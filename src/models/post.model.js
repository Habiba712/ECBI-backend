const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      referralUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    pos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PointOfSale",
      required: true,
    },

    photoUrl: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    // A UNIQUE referral link per post?? BAD IDEA
   
comments: [{
       userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Allows you to populate user data (avatar, name) for the comment UI
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Tracks when the comment was posted natively
    }
    }],
likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
shares:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Share',
        required: false
    }],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
