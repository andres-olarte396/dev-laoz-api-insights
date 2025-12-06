const SystemLog = require('../models/SystemLog');
const AuditLog = require('../models/AuditLog');
const HttpTransaction = require('../models/HttpTransaction');

// Almacén de clientes SSE conectados
let sseClients = [];

/**
 * Función helper para enviar evento a todos los clientes SSE
 * @param {string} type - Tipo de evento (log, audit, transaction)
 * @param {object} data - Datos del evento
 */
const broadcastSSE = (type, data) => {
    const payload = JSON.stringify({ type, timestamp: new Date(), data });
    sseClients.forEach(client => {
        client.res.write(`data: ${payload}\n\n`);
    });
};

/**
 * Endpoint para conectar al stream de eventos (SSE)
 */
exports.streamLogs = (req, res) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const clientId = Date.now();
    const newClient = {
        id: clientId,
        res
    };
    sseClients.push(newClient);

    console.log(`Nuevo cliente SSE conectado (${clientId}). Total: ${sseClients.length}`);

    // Enviar mensaje inicial
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Conectado al stream de Insights' })}\n\n`);

    // Limpiar cliente al desconectar
    req.on('close', () => {
        console.log(`Cliente SSE desconectado (${clientId})`);
        sseClients = sseClients.filter(c => c.id !== clientId);
    });
};

/**
 * Ingestar Log de Sistema
 */
exports.ingestLog = async (req, res) => {
    try {
        const log = new SystemLog(req.body);
        await log.save();

        // Emitir en tiempo real
        broadcastSSE('log', log);

        res.status(201).json({ success: true, id: log._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Ingestar Log de Auditoría
 */
exports.ingestAudit = async (req, res) => {
    try {
        const audit = new AuditLog(req.body);
        await audit.save();

        // Emitir en tiempo real (prioridad alta)
        broadcastSSE('audit', audit);

        res.status(201).json({ success: true, id: audit._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * Ingestar Transacción HTTP
 */
exports.ingestTransaction = async (req, res) => {
    try {
        const transaction = new HttpTransaction(req.body);
        await transaction.save();

        // Opcional: Emitir transacción? Puede ser mucho volumen.
        // Lo emitiremos solo si es slow o error para no saturar SSE.
        if (transaction.durationMs > 1000 || transaction.statusCode >= 400) {
            broadcastSSE('transaction_alert', transaction);
        }

        res.status(201).json({ success: true }); // No devolvemos ID para ser más rápido
    } catch (error) {
        // No fallar request original si falla log de transacción, solo loguear error consola
        console.error('Error guardando transacción:', error.message);
        res.status(400).json({ error: error.message });
    }
};
