const mongoose = require('mongoose');

const FileUpload = require('../../models/media.model');
const cloudinary = require('../../config/cloudinary');
const Post = require('../../models/post.model');
const ReferralLink = require('../../models/refferal.model');
const User = require('../../models/user.model');
const PointOfSale = require('../../models/pointOfSale.model');
const Notification = require('../../models/notif.model');
 // const { Readable } = require('stream');
const postController = {};


console.log('post controller');
// function generateReferralCode() {
//   return Math.random().toString(36).substring(2, 10); // 8 chars
// }

postController.scanQr = async (req, res, next) => {


  try {


    const { qrCodeData } = req.body; // or req.body.qrCodeData if POST
    // Find POS by qrCodeData
    // const qrCode=  JSON.strinkgify(qrCodeData);
    const pos = await PointOfSale.findOne({ qrCodeData: qrCodeData });

    if (!pos) {
      return res.status(404).json({ message: 'POS not found' });
    }

    // Return POS info so frontend / Postman knows where to upload
    return res.status(200).json({
      message: 'POS found. You can upload a post now.',
      pos: pos._id,
      posName: pos.name
    });

  } catch (err) {
    next(err);
  }
};



postController.createPost = async (req, res) => {
  console.log("CREATE POST HIT");

  try {
    const { caption, owner, referralUser, pos } = req.body;

    if (!owner || !pos) {
      return res.status(400).json({ message: "Missing owner or pos" });
    }

    const newReferralUser =
      referralUser && referralUser !== "" && referralUser !== "null"
        ? referralUser
        : undefined;

    const ownerId = new mongoose.Types.ObjectId(owner);
    const posId = new mongoose.Types.ObjectId(pos);

    // 1. Fetch user + POS
    const userDoc = await User.findById(ownerId);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    //ANTI-EXPLOIT PROTECTION
    let shouldAwardPostReferralPoints = false;
    
    if (newReferralUser && newReferralUser !== owner) {
      // Check if this friend (owner) has already been rewarded under this link-owner's links
      const alreadyRewarded = await ReferralLink.findOne({
        owner: newReferralUser,
        "referredUsers.user": ownerId,
        "referredUsers.rewarded": true
      });

      // If they haven't been rewarded yet, flip the switch to allow point updates later
      if (!alreadyRewarded) {
        shouldAwardPostReferralPoints = true;
      }
    }

    const posDoc = await PointOfSale.findById(posId).populate("ownerId");
    const businessName = posDoc?.ownerId?.ownerInfo?.businessName || "Unknown";

    // 2. Upload image
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "posts" },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // 3. Create post
    const newPost = await Post.create({
      owner,
      referralUser: newReferralUser,
      pos: posId,
      photoUrl: uploadResult.secure_url,
      caption,
    });

    // 4. Notification (Modified to check our safety guard switch)
    if (shouldAwardPostReferralPoints) {
      await Notification.create({
        recipient: newReferralUser,
        sender: owner,
        message: "You gained 50 points via referral link!",
      });
      
      // Update the referral tracking log to show this user's conversion points have been settled
      await ReferralLink.updateOne(
        { owner: newReferralUser, "referredUsers.user": ownerId },
        { $set: { "referredUsers.$.rewarded": true } }
      );
    }

    // 5. VISIT HISTORY
    const visitHistory = userDoc.finalUser.visitHistory || [];
    const existing = visitHistory.length > 0 && visitHistory.find(v =>
      v.pointOfSaleId && 
      v.pointOfSaleId.toString() === posId.toString()
    );

    if (!existing) {
      visitHistory.push({
        pointOfSaleId: posId,
        businessName,
        date: new Date(),
        pointsEarned: 50,
        count: 1,
      });
    } else {
      existing.count += 1;
      existing.date = new Date();
    }

    // 6. VISITS ARRAY (safe dedupe)
    const visits = new Set(
      (userDoc.finalUser.visits || []).map(v => v.toString())
    );
    visits.add(posId.toString());

    // 7. SINGLE ATOMIC UPDATE
    await User.updateOne(
      { _id: ownerId },
      {
        $set: {
          "finalUser.visitHistory": visitHistory,
          "finalUser.visits": Array.from(visits).map(
            id => new mongoose.Types.ObjectId(id)
          ),
        },
        $push: {
          "finalUser.posts": newPost._id,
        },
      }
    );

    // 8. Update POS
    await PointOfSale.findByIdAndUpdate(posId, {
      $push: { posts: newPost._id },
      $inc: { "stats.totalVisits": 1 },
    });

    // 9. RESPONSE
    return res.json({
      message: "Post created successfully",
      post: newPost,
      referralPointsAwarded: shouldAwardPostReferralPoints
    });
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
















postController.getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

postController.getPostByOwnerId = async (req, res, next) => {
  try {
    const { ownerId } = req.params;
    const posts = await Post.find({ owner: ownerId });
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};
postController.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate(['owner', 'pos', 'comments.userId']).sort({ createdAt: -1 });
    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};


postController.likes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, newLikes } = req.body;

    // 1. Structural Payload Validations
    if (!userId) {
      return res.status(400).json({ message: "userId is required to modify likes array" });
    }
    if (newLikes !== 1 && newLikes !== -1) {
      return res.status(400).json({ message: "Invalid payload: newLikes must be exactly 1 or -1" });
    }

    // 2. Select MongoDB array modifier depending on the incoming integer
    // If 1: use $addToSet to add the userId uniquely (ignores duplicates)
    // If -1: use $pull to strip the userId completely from the array
    const updateOperator = newLikes === 1
      ? { $addToSet: { likes: userId } }
      : { $pull: { likes: userId } };

    // 3. Atomically update the document and return the freshly modified array
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateOperator,
      { new: true } // Crucial: gives us the array AFTER the push/pull happens
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 4. Guaranteed Terminal Response: Dynamically calculate count via .length
    return res.status(200).json({
      message: newLikes === 1 ? "Like added successfully" : "Like removed successfully",
      likesCount: updatedPost.likes.length, // Extracted directly from array footprint
      likes: updatedPost.likes
    });

  } catch (error) {
    next(error);
  }
};

postController.comments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;

    // 1. Structural Payload Validations
    if (!userId) {
      return res.status(400).json({ message: "userId is required to modify comments array" });
    }
    if (comment == "" || comment === undefined) {
      return res.status(400).json({ message: "Invalid payload: comment must be a non-empty string" });
    }


    const updateOperator = comment !== ""
      && {
      $addToSet:
      {
        comments: {
          userId: userId,
          comment: comment
        }
      }
    };


    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateOperator,
      { new: true } // Crucial: gives us the array AFTER the push/pull happens
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 4. Guaranteed Terminal Response: Dynamically calculate count via .length
    return res.status(200).json({
      message: comment !== "" && "Comment added successfully",
      commentsCount: updatedPost.comments.length, // Extracted directly from array footprint

    });

  } catch (error) {
    next(error);
  }
};
module.exports = postController;