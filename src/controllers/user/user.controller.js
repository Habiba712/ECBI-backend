

const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const PointOfSale = require('../../models/pointOfSale.model');

const userController = {};

userController.createOwner= async(req, res, next)=>{
  try{
    const {email, userName, pointOfSaleName, password, telephone} = req.body;
    console.log(email, userName, pointOfSaleName, password, telephone)

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message: "User Already Exists in the database"});

    }

    const checkPointOfSale = await PointOfSale.findOne({name: pointOfSaleName});
    console.log('point of sale',checkPointOfSale)

    if(!checkPointOfSale){
        return res.status(400).json({message: "Point Of Sale Doesn Not Exsist"})
    }

    
    const newUSer = new User({
        email, 
        username: userName,
        telephone,
        role:"RESTO_SUPER_ADMIN",
        pointOfSale: checkPointOfSale._id,
        password: await bcrypt.hash(password, 10)
    })
   
    await newUSer.save();
    return res.status(201).json({message:"User Created Successfully", user: newUSer});
  }catch(err){
    next(err)
  }
}

userController.register= async(req, res, next)=>{
  try{
    const {email, username,  password, phone} = req.body;
    console.log(email, username, password, phone)

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message: "User Already Exists in the database"});

    }

    // const checkPointOfSale = await PointOfSale.findOne({name: pointOfSaleName});

    // if(!checkPointOfSale){
    //     return res.status(400).json({message: "PointOf Sale Doesn Not Exsist"})
    // }

    
    const newUSer = new User({
        email, 
        username: username,
        telephone: phone,
   
        
        password: await bcrypt.hash(password, 10)
    })
   
    await newUSer.save();
    return res.status(201).json({message:"User Created Successfully", user: newUSer});
  }catch(err){
    next(err)
  }
}

module.exports = userController;