

const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const PointOfSale = require('../../models/pointOfSale.model');

const userController = {};

userController.createOwner= async(req, res, next)=>{
  try{
    const {email,
         userName,
telephone,
avatar,
businessName,
pointOfSaleName,
totalRestaurants, password

} = req.body;
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
        avatar,
        businessName,
        totalRestaurants,
        password: await bcrypt.hash(password, 10)
    })
   
    await newUSer.save();
    return res.status(201).json({message:"User Created Successfully", user: newUSer});
  }catch(err){
    next(err)
  }
}

userController.updateOwner = async (req, res, next) =>{
    try{
const {id} = req.params;
const updateData = req.body;
const user = await User.findByIdAndUpdate(id, updateData);

res.status(202).json({ message: 'User updated successfully', data: user });

if (!user) {
    return res.status(404).json({ message: 'User not found' });
}
    }catch(err){
        next(err)
    }
}

userController.register= async(req, res, next)=>{

    console.log('are we here')
  try{
    const {email, username,  password, phone,
        avatar, points, preferences, visitHistory

    } = req.body;
    console.log(email, username, password, phone, preferences)

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message: "User Already Exists in the database"});

    }

    // const checkPointOfSale = await PointOfSale.findOne({name: pointOfSaleName});

    // if(!checkPointOfSale){
    //     return res.status(400).json({message: "PointOf Sale Doesn Not Exsist"})
    // }
let prefsToSave = {
      notifications: true,
      emailUpdates: true,
      favoriteCuisines: []
    };

    if(Array.isArray(preferences)){
        prefsToSave.favoriteCuisines = preferences
    }
    const newUSer = new User({
        email, 
        username: username,
        telephone: phone,
        avatar,
        points,
        preferences:prefsToSave,

        visitHistory:{
            ...visitHistory
        },

   
        
        password: await bcrypt.hash(password, 10)
    })
   
    await newUSer.save();
    return res.status(201).json({message:"User Created Successfully", user: newUSer});
  }catch(err){
    next(err)
  }
}

userController.updateUser= async (req,res, next)=> {
    try{
        const {id} = req.params;
        const updateData = req.body;
        const user = await User.findByIdAndUpdate(id, updateData);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'User updated successfully', data: user });  

    }catch(err){

    }
}

module.exports = userController;