
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({

    pointOfSaleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PointOfSale",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
   
    },
  
    visitedAt:{
        type:Date,
        default:Date.now,
        
    },
    ownerReply:{
        type:String,
        required:false,
      
    },
    ownerReplyDate:{
        type:Date,
        default:Date.now
    }

},
{
    timestamps: true
}

)


const Review = mongoose.model('Review', ReviewSchema);
module.exports= Review;