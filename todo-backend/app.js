const express = require('express');
const bodyParser = require('body-parser');
const cros = require('cors');
const mongoose = require('mongoose')
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const morgan = require('morgan');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cros({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => { console.log('Connected to database')})
.catch((err) => { console.log('Connection failed', err.message)});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/collections', collectionRoutes);

module.exports = app;