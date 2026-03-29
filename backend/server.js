const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const { startWeeklyHarvestScheduler } = require('./jobs/weeklyHarvestScheduler');

const startServer = async () => {
    try {
        await connectDB();

        app.listen(env.port, () => {
            console.log(`Server running on http://localhost:${env.port}`);

            if (env.autoHarvestOnStart) {
                startWeeklyHarvestScheduler();
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
