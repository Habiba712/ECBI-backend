const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    // A UNIQUE referral link per post
    referralLink: {
      type: String,
      unique: true,
      required: false,
    },
comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],
likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like',
        required: false
    }],
shares:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Share',
        required: false
    }],
    // Users who signed up using THIS post's referral link
    referredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
