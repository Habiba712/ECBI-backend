const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const apiRouter = require('./routes/index.routes');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ["https://ecbi-frontend-9ww4.vercel.app"], // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());
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