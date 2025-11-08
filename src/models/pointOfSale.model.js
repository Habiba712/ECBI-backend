const mongoose = require('mongoose');


const pointOfSaleSchema = new mongoose.Schema({
  // === BASIC INFO ===
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // === OWNER RELATIONSHIP === ⭐ CRITICAL!
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true  // Index for fast queries!
  },
  
  // === CONTACT & LOCATION ===
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  phone: String,
  email: String,
  website: String,
  description: {
    type: String,
    maxlength: 1000,
    required: false
  },
  
  // === QR CODE & BRANDING ===
  qrCodeData: {
    type: String,
    unique: true,
    required: false,
    index: true  // Fast QR lookups when clients scan!
  },
  logo: {
    type: String,
    required: false
  },  // URL to logo image
  coverImage: {
    type: String,
    required: false
  },  // URL to cover/hero image
  
  // === BUSINESS DETAILS ===
  description: {
    type: String,
    maxlength: 1000
  },
  cuisine: {
    type: String,
    enum: [
      'Italian', 'Japanese', 'American', 'Mexican', 'Thai', 
      'Chinese', 'Indian', 'French', 'Mediterranean', 
      'Korean', 'Vietnamese', 'Greek', 'Spanish', 'Cafe', 'Other'
    ]
  },
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$']
  },
  
  // === OPERATING HOURS ===
  hours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  
  // === STATISTICS === (updated automatically)
  stats: {
    totalVisits: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    pointsRedeemed: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 }
  },
  
  // === RATING BREAKDOWN ===
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  },
  
  // === STATUS & VERIFICATION ===
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended'],
    default: 'pending'
  },
  verified: {
    type: Boolean,
    default: false
  },
  
  // === FEATURES & AMENITIES ===
  features: [{
    type: String,
    enum: [
      'wifi', 'parking', 'outdoor_seating', 'takeout', 
      'delivery', 'reservations', 'wheelchair_accessible',
      'kid_friendly', 'pet_friendly', 'live_music', 
      'bar', 'credit_cards', 'vegan_options', 'gluten_free'
    ]
  }],
  
  // === SOCIAL MEDIA ===
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    tiktok: String
  },
  
  // === METADATA ===
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastVisit: Date,  // Track when last customer visited
  
  // === SOFT DELETE ===
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
  
}, {
  timestamps: true  // Auto-manages createdAt & updatedAt
});



// === INDEXES FOR PERFORMANCE ===
pointOfSaleSchema.index({ ownerId: 1, status: 1 });
pointOfSaleSchema.index({ qrCode: 1 });
pointOfSaleSchema.index({ 'address.city': 1, 'address.state': 1 });
pointOfSaleSchema.index({ cuisine: 1 });
pointOfSaleSchema.index({ 'stats.averageRating': -1 });

// === VIRTUAL FIELDS ===
// pointOfSaleSchema.virtual('fullAddress').get(function() {
//   return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
// });

// === METHODS ===

// Update statistics when new review/visit comes in
// pointOfSaleSchema.methods.updateStats = async function() {
//   const Review = mongoose.model('Review');
  
//   const reviews = await Review.find({ restaurantId: this._id });
  
//   this.stats.totalReviews = reviews.length;
  
//   if (reviews.length > 0) {
//     const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//     this.stats.averageRating = (totalRating / reviews.length).toFixed(1);
    
//     // Update rating distribution
//     this.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     reviews.forEach(review => {
//       this.ratingDistribution[review.rating]++;
//     });
//   }
  
//   await this.save();
// };

// Check if restaurant is open now
// pointOfSaleSchema.methods.isOpenNow = function() {
//   const now = new Date();
//   const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
//   const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
//   const todayHours = this.hours[dayName];
  
//   if (!todayHours || todayHours.closed) return false;
  
//   return currentTime >= todayHours.open && currentTime <= todayHours.close;
// };

const PointOfSale = mongoose.model('PointOfSale', pointOfSaleSchema);
module.exports = PointOfSale;