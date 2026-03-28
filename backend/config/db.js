const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
    await mongoose.connect(env.mongodbUrl);
    console.log('MongoDB connected');
};

module.exports = connectDB;
