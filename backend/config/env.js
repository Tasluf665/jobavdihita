const dotenv = require('dotenv');

dotenv.config();

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    mongodbUrl: process.env.MONGODB_URL,
};

if (!env.mongodbUrl) {
    throw new Error('Missing required environment variable: MONGODB_URL');
}

module.exports = env;
