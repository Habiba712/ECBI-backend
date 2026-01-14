const mongoose = require('mongoose');
const ReferralLink = require('../../models/refferal.model');
const { v4: uuidv4 } = require('uuid');

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 10); // 8 chars
}

const referralLinkController = {};

referralLinkController.createReferralLink = async (req, res, next) =>{

    const { userId, posId } = req.body;
    try{
 // Generate unique referral link for this post
    const referralCode = generateReferralCode();
    const referralLink = `${process.env.FRONTEND_URL}/ref/${referralCode}`;
    const existingRefferalLink = await ReferralLink.findOne({ referrerUser: userId, pos: posId });
    if (existingRefferalLink) {
      return res.status(201).json({ message: 'Referral Link for this POS already exists',  link: existingRefferalLink });
    }
    else{
 const newReferralLink = new ReferralLink({
      referrerUser: userId,
      pos: posId,
      linkId: referralCode,
   })

   await newReferralLink.save();

   return res.status(201).json({message:"Referral Link for this POS is created successfully", referralLink: newReferralLink, link: referralLink});
    }
  
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
    //  if (req.user) {
    //   // If logged-in user already tracked?
    //   const existing = referralLink.referredUsers.find(u => u.user?.toString() === req.user._id.toString());
    //   if (!existing) {
    //     referralLink.referredUsers.push({ user: req.user._id, clickedAt: new Date() });
    //   }
    // }else {
      // Anonymous visitor
      let tempId = req.cookies?.tempId || uuidv4();
      res.cookie('tempId', tempId, { maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days

      const existingAnon = referralLink.referredUsers.find(u => u.tempId === tempId);
      if (!existingAnon) {
        referralLink.referredUsers.push({ tempId, clickedAt: new Date() });
    //   }
    }
    
await referralLink.save();
    return res.status(200).json(referralLink);
    }catch(err){
        next(err)
    }

}

module.exports = referralLinkController;