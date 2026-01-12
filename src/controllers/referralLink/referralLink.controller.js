const mongoose = require('mongoose');
const ReferralLink = require('../../models/refferal.model');


function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10); // 8 chars
}

const referralLinkController = {};

referralLinkController.createReferralLink = async (req, res, next) =>{

    const { userId, posId } = req.body;
    try{
 // Generate unique referral link for this post
    const referralCode = generateReferralCode();
    const referralLink = `${process.env.FRONTEND_URL}/pages/ref/${referralCode}`;
   const newReferralLink = new ReferralLink({
      referrerUser: userId,
      pos: posId,
      linkId: referralCode,
   })

   await newReferralLink.save();

   return res.status(201).json({message:"Referral Link for this POS is created successfully", referralLink: referralLink});
    }catch(err){
        next(err)
    }
}

referralLinkController.getReferralLinkByLink= async (req, res, next)=>{

    const { linkId } = req.params;
    console.log('linkId', linkId);

    try{
    const referralLink = await ReferralLink.findOne({linkId});
    if (!referralLink) {
        return res.status(404).json({ message: 'Referral Link not found' });
    }
    const incrementClicks = await ReferralLink.findOneAndUpdate(
      {linkId},
      {$inc : {clicks: 1}}
    );
    

    return res.status(200).json(incrementClicks);
    }catch(err){
        next(err)
    }

}

module.exports = referralLinkController;