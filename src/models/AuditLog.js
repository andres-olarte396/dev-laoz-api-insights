const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    actor: { type: String, required: true, index: true }, // admin, user_email, system
    action: { type: String, required: true }, // LOGIN, CREATE_REPO, DELETE_USER
    target: { type: String }, // user_id, repo_name
    outcome: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
    ip: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
}, {
    timestamps: true
});

// TTL Index: Borrar auditoría después de 90 días (7776000 segundos) - más persistencia que logs
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
