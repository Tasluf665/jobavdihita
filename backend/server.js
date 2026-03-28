const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const { runPipeline1 } = require('./pipelines');
const logger = require('./utils/logger');

const startServer = async () => {
    try {
        await connectDB();

        app.listen(env.port, () => {
            console.log(`Server running on http://localhost:${env.port}`);

            if (env.autoHarvestOnStart) {
                logger.info('startup_harvest_triggered', {
                    stateName: env.autoHarvestStateName,
                    forceRefresh: false,
                });

                runPipeline1({
                    stateName: env.autoHarvestStateName,
                    forceRefresh: false,
                })
                    .then((result) => {
                        logger.info('startup_harvest_finished', result);
                    })
                    .catch((error) => {
                        logger.error('startup_harvest_failed', {
                            message: error.message,
                            stack: error.stack,
                        });
                    });
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
