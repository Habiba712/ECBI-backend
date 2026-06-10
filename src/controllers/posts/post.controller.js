const mongoose = require('mongoose');

const FileUpload = require('../../models/media.model'); 
const cloudinary = require('../../config/cloudinary'); 
 const Post = require('../../models/post.model');
const User = require('../../models/user.model');
const PointOfSale = require('../../models/pointOfSale.model');
const Notification = require('../../models/notif.model');
// const { Readable } = require('stream');
const postController={};


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
  try {
    console.log('create post', req.body);
   const { caption, owner, referralUser, pos } = req.body;
   console.log('referralUser', referralUser);
 
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
    // const referralCode = generateReferralCode();
    // const referralLink = `${process.env.FRONTEND_URL}/ref/${referralCode}`;

    // Create post
    const newPost = new Post({
      owner: owner,
      referralUser: referralUser,
      pos: pos,
      photoUrl: uploadResult.secure_url,
      caption,
      // referralLink,
    });

     await newPost.save();

     // the notification should probably be created here, no? 
     console.log('referralUser', referralUser);
     console.log('owner', owner);
    const newNotif = new Notification({
      recipient: referralUser,
      sender: owner, // not the owner of the post, the owner of the referral link that was sent.
      message: 'You gained 50 points via referral link to ' 
    });
    await newNotif.save();


    // Add post to User
const updatedUser = await User.findById(owner);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    else{
     const updatedUser = await User.updateOne({_id: owner}, {
      $push: { "finalUser.posts": newPost._id },
      $addToSet: { "finalUser.visits": pos }
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
 postController.getAllPosts= async (req, res, next) => {
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
      && { $addToSet:
         {comments: {
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
      message: comment !== "" && "Comment added successfully" ,
      commentsCount: updatedPost.comments.length, // Extracted directly from array footprint
       
    });

  } catch (error) {
    next(error);
  }
};
module.exports = postController;