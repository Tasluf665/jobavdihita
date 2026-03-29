const dotenv = require('dotenv');

dotenv.config();

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    mongodbUrl: process.env.MONGODB_URL,
    adminKey: process.env.ADMIN_KEY || '',
    autoHarvestOnStart: String(process.env.AUTO_HARVEST_ON_START || 'true') === 'true',
    autoHarvestStateName: process.env.AUTO_HARVEST_STATE_NAME || 'Munshiganj',
    autoHarvestCron: process.env.AUTO_HARVEST_CRON || '0 3 * * 0',
    autoHarvestTimezone: process.env.AUTO_HARVEST_TIMEZONE || 'Asia/Dhaka',
};

if (!env.mongodbUrl) {
    throw new Error('Missing required environment variable: MONGODB_URL');
}

module.exports = env;
