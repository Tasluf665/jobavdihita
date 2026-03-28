const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'API is running',
    });
});

router.get('/health', (_req, res) => {
    res.json({
        success: true,
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;
