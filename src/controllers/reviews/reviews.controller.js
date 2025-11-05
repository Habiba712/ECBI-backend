const mongoose = require('mongoose');
const Review = require('../../models/reviews.model');
const User = require('../../models/user.model');
const QRCode = require('qrcode');
const reviewsController = {};



reviewsController.createReview = async (req, res, next)=>{

    try{
        const {pointOfSaleId, userId, rating, comment, ownerReply} = req.body;

        const review = new Review({
            pointOfSaleId,
            userId,
            rating,
            comment,
            ownerReply
        })

        await review.save();
        res.status(201).json({message:"Review Created Successfully", review});
const updatedTotalReviews = await User.findByIdAndUpdate(userId, {$inc: {totalReviews: 1}});
await updatedTotalReviews.save();

    }catch(err){
        next(err)
    }
}

reviewsController.getAllReviews = async (req, res, next) =>{
    try{
        const getReviews = await Review.find().populate(['pointOfSaleId' , 'userId']);
        res.status(200).json({message:"All Reviews Fetched Successfully", getReviews});
// we still need to make sure that the right owner is who s getting the reviews
    }catch(err){
        next(err)
    }
}

reviewsController.updateReviews = async (req, res, next) =>{
    console.log('updateReviews');
    try{
        const {id} = req.params;
        const updateData = req.body;
        console.log('updateData', id, updateData);
        const updatedReview = await Review.findByIdAndUpdate(id, updateData);

        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }

        return res.status(200).json({ message: 'Review updated successfully', data: updatedReview });

    }catch(err){
        next(err)
    }
}
module.exports = reviewsController;
