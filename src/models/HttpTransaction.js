const mongoose = require('mongoose');

const HttpTransactionSchema = new mongoose.Schema({
    traceId: { type: String, index: true }, // ID único para rastrear petición por servicios
    service: { type: String, required: true },
    path: { type: String, required: true },
    method: { type: String, required: true },
    statusCode: { type: Number, required: true },
    durationMs: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now, index: true },
    clientIp: { type: String }
}, {
    timestamps: true
});

// TTL Index: Borrar métricas HTTP después de 3 días (259200 segundos)
HttpTransactionSchema.index({ timestamp: 1 }, { expireAfterSeconds: 259200 });

module.exports = mongoose.model('HttpTransaction', HttpTransactionSchema);
