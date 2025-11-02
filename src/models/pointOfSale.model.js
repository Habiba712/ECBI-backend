const mongoose = require('mongoose');

const PointOfSaleSchema = new mongoose.Schema({
  website: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User", // Reference the User collection
    required: false, // Make it optional
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: '',
  },
  qrCodeData:{
    type: String,
    required: false,
    default: ''
  },
  state: {
    type: String,
    enum: ['blocked', 'actif'],
    default: 'actif',
  },
  visibility: {
    type: String,
    enum: ['show', 'no show'],
    default: 'show',
  },
}, {
  timestamps: true,
});


const PointOfSale = mongoose.model('PointOfSale', PointOfSaleSchema);

module.exports = PointOfSale;
