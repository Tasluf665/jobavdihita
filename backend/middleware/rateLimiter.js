const windowMs = 24 * 60 * 60 * 1000;
const maxRequests = 3;
const cache = new Map();

const fieldReportRateLimiter = (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const tenderId = req.body?.tender_id || 'unknown';
    const key = `${ip}:${tenderId}`;
    const now = Date.now();

    const existing = cache.get(key) || [];
    const validWindow = existing.filter((ts) => now - ts < windowMs);

    if (validWindow.length >= maxRequests) {
        return res.status(429).json({
            success: false,
            message: 'Rate limit exceeded for this contract. Try again later.',
        });
    }

    validWindow.push(now);
    cache.set(key, validWindow);
    return next();
};

module.exports = {
    fieldReportRateLimiter,
};
