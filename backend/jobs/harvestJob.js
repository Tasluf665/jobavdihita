const connectDB = require('../config/db');
const { runPipeline1 } = require('../pipelines');
const logger = require('../utils/logger');

const run = async () => {
    const maxPagesArg = process.argv.find((arg) => arg.startsWith('--maxPages='));
    const maxPages = maxPagesArg ? Number(maxPagesArg.split('=')[1]) : null;
    const forceRefresh = process.argv.includes('--forceRefresh');

    await connectDB();
    const result = await runPipeline1({ stateName: 'Munshiganj', maxPages, size: 10, forceRefresh });
    logger.info('pipeline1_finished', result);
    process.exit(0);
};

if (require.main === module) {
    run().catch((error) => {
        logger.error('pipeline1_failed', { message: error.message, stack: error.stack });
        process.exit(1);
    });
}

module.exports = {
    runHarvestJob: run,
};
