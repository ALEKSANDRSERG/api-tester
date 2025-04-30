let requestCount = 0;
let totalResponseTime = 0;
let averageResponseTime = 0;
let errorCount = 0;
let maxResponseTime = 0;

const collectMetrics = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        requestCount++;
        totalResponseTime += duration;
        averageResponseTime = totalResponseTime / requestCount;
        maxResponseTime = Math.max(maxResponseTime, duration);
        if (res.statusCode >= 400) errorCount++;
    });
    next();
};

const getMetrics = (req, res) => {
    const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;
    const reliability = 100 - errorRate;

    res.json({
        timestamp: Date.now(),
        requestCount,
        averageResponseTime: Number(averageResponseTime.toFixed(2)),
        maxResponseTime,
        errorCount,
        errorRate: Number(errorRate.toFixed(2)),
        reliability: Number(reliability.toFixed(2))
    });
};

function updateMetrics(duration, statusCode) {
    requestCount++;
    totalResponseTime += duration;
    averageResponseTime = totalResponseTime / requestCount;
    maxResponseTime = Math.max(maxResponseTime, duration);
    if (statusCode >= 400) errorCount++;
}


module.exports = {
    collectMetrics,
    getMetrics,
    updateMetrics,
};
