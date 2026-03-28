const express = require('express');
const apiRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
    res.json({
        message: 'Jobavdihita backend is running',
    });
});

app.use('/api', apiRoutes);

module.exports = app;
