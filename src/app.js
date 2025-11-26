const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const apiRouter = require('./routes/index.routes');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }));



const whitelist = process.env.CORS_ALLOW || "*";
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || whitelist.indexOf("*") !== -1) {
            callback(null, true);
        } else {
            const err = new Error('Access Denied');
            err.status = 403;
            callback(err);
        }
    }
}

app.use(cors(corsOptions));

// app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));



app.use('/api', apiRouter);

app.get('/', (req, res) => res.send('ECBI API'));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;