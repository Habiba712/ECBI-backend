const mongoose = require('mongoose');

const FileUpload = require('../../models/media.model'); // Import your mongoose model
const cloudinary = require('../../config/cloudinary'); // Import Cloudinary config
 const Post = require('../../models/post.model');
const User = require('../../models/user.model');
const PointOfSale = require('../../models/pointOfSale.model');

// const { Readable } = require('stream');
const postController={};


console.log('post controller');
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10); // 8 chars
}

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
  try {
    console.log('create post', req.body);
   const { caption, owner, pos } = req.body;

    if (!owner || !pos) {
      return res.status(400).json({ message: "Missing owner or pos" });
    }

    
   if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
console.log('req.file', req.file);
    // Upload file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "posts" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Generate unique referral link for this post
    const referralCode = generateReferralCode();
    const referralLink = `${process.env.FRONTEND_URL}/ref/${referralCode}`;

    // Create post
    const newPost = new Post({
      owner: owner,
      pos: pos,
      photoUrl: uploadResult.secure_url,
      caption,
      referralLink,
    });

     await newPost.save();

    // Add post to User
const updatedUser = await User.findById(owner);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    else{
     const updatedUser = await User.updateOne({_id: owner}, {
      $push: { "finalUser.posts": newPost._id },
       });
      console.log('updatedUser', updatedUser);
    }

    // Add post to POS
    await PointOfSale.findByIdAndUpdate(pos, {
      $push: { posts: newPost._id },
       });

    return res.json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post', error);
    return res.json({ message: error.message });
  }
};

module.exports = postController;