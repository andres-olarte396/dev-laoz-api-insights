const mongoose = require('mongoose');

const SystemLogSchema = new mongoose.Schema({
    service: { type: String, required: true, index: true },
    level: { type: String, enum: ['info', 'warn', 'error', 'debug'], default: 'info' },
    message: { type: String, required: true },
    stack: { type: String }, // Para errores
    metadata: { type: mongoose.Schema.Types.Mixed }, // JSON flexible
    timestamp: { type: Date, default: Date.now, index: true },
}, {
    timestamps: true
});

// TTL Index: Borrar logs después de 7 días (604800 segundos)
SystemLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('SystemLog', SystemLogSchema);
