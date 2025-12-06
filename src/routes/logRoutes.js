const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Ingesta
router.post('/log', logController.ingestLog);
router.post('/audit', logController.ingestAudit);
router.post('/transaction', logController.ingestTransaction);

// Streaming Real-time
router.get('/stream', logController.streamLogs);

module.exports = router;
