const mongoose = require('mongoose');
const { mongodbUri } = require('./index');

async function connectDB() {
  if (!mongodbUri) {
    console.warn('No MONGODB_URI provided; skipping DB connect in config.');
    return;
  }
  try {
    await mongoose.connect(mongodbUri, {
      // recommended options are default in Mongoose 6+, keep simple
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Optionally rethrow or process.exit(1) depending on needs
  }
}

module.exports = { connectDB };