const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const apiRouter = require('./routes/index.routes');

const app = express();
app.use(express.urlencoded({ extended: true }));



const corsOptions = {
    origin: ['https://ecbi-frontend-9ww4.vercel.app'], // Replace with your actual frontend origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and authentication headers
    optionsSuccessStatus: 204 // For preflight requests
};
app.use(cors(corsOptions));
// app.use(cors({
//   origin: 'https://ecbi-frontend-9ww4.vercel.app', // Replace with your actual frontend domain
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true, // If you're using cookies or authorization headers
//   optionsSuccessStatus: 204 // Recommended for preflight requests
// }));

// // Or, to allow all origins (for development, use with caution in production)
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