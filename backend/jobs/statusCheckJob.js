const connectDB = require('../config/db');
const { runPipeline2 } = require('../pipelines');
const logger = require('../utils/logger');

const run = async () => {
    const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
    const delayArg = process.argv.find((arg) => arg.startsWith('--delayMs='));
    const forceRefresh = process.argv.includes('--forceRefresh');

    const limit = limitArg ? Number(limitArg.split('=')[1]) : null;
    const requestDelayMs = delayArg ? Number(delayArg.split('=')[1]) : 1200;

    await connectDB();
    const result = await runPipeline2({
        district: 'Munshiganj',
        limit,
        requestDelayMs,
        forceRefresh,
    });

    logger.info('pipeline2_finished', result);
    process.exit(0);
};

if (require.main === module) {
    run().catch((error) => {
        logger.error('pipeline2_failed', {
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    });
}

module.exports = {
    runStatusCheckJob: run,
};

