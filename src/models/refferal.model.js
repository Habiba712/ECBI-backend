// models/ReferralLink.js
const mongoose = require('mongoose');

const ReferredUserSub = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false },

  tempId: { type: String, default: null }, // for anonymous clicks

  joinedAt: { 
    type: Date, 
    default: Date.now },
            // when they created an account (if applicable)
  clickedAt: {
     type: Date,
    default: null },
              // when they clicked the link
  visited: { 
    type: Boolean, 
    default: false },
            // did they visit/scan POS?
  // visitedAt: { 
  //   type: Date, 
  //   default: null },

  // photosUploaded: { 
  //   type: Boolean, 
  //   default: false },
  //    // did they upload required photos?
  // photosUploadedAt: { 
  //   type: Date, 
  //   default: null },

  rewarded: { 
    type: Boolean, 
    default: false },
          // has the referrer already been rewarded for this user?
  pointsAwarded: {
     type: Number, 
     default: 0 }       // points given to referrer for this referred user
}, { _id: false });

const ReferralLinkSchema = new mongoose.Schema({

  referrerUser: {
     type: mongoose.Schema.Types.ObjectId, // owner of the link
     ref: 'User', 
     required: true }, 
     // 
     
  pos: { 
    type: mongoose.Schema.Types.ObjectId, // the POS this link targets
    ref: 'PointOfSale', 
    required: true }, 
       
  linkId: { 
    type: String,  // short token used in URLs
    required: true, 
    unique: true },
    
   
  clicks: { 
    type: Number, 
    default: 0,
   
  },

  successfulReferrals: { 
    type: Number, // count of referredUsers that passed reward criteria
    default: 0 },
     
  pointsEarned: {  // total points earned via this link
    type: Number, 
    default: 0 },
           
  isActivated: { 
    type: Boolean, 
    default: false },
       // becomes true once referrer completes required steps
  referredUsers: [ReferredUserSub]                   // list of referred users + per-user state
}, { timestamps: true });

// helpful indexes
ReferralLinkSchema.index({ referrerUser: 1, pos: 1 });
ReferralLinkSchema.index({ linkId: 1 }, { unique: true });

module.exports = mongoose.model('ReferralLink', ReferralLinkSchema);
