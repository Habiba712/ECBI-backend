

const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const PointOfSale = require('../../models/pointOfSale.model');
const { z,ZodError } = require("zod");

const userController = {};

userController.createOwner= async(req, res, next)=>{
  try{
    const {email,
         userName,
        telephone,
        avatar,
        businessName,
        pointOfSaleName,
        password

} = req.body;
    console.log(email, userName, pointOfSaleName, password, telephone)

    const existingUser = await User.findOne({"ownerInfo.email": email });
     if(existingUser){
        return res.status(400).json({message: "User Already Exists in the database"});

    }

    const checkPointOfSale = await PointOfSale.findOne({name: pointOfSaleName});
    // console.log('point of sale',checkPointOfSale)
console.log('checkPointOfSale', checkPointOfSale.name)
    if(!checkPointOfSale){
        return res.status(400).json({message: "Point Of Sale Doesn Not Exsist"})
    }

    //check if the point of sale is already owned by ANOTHER user
    if (checkPointOfSale.ownerId !== null) {
        console.log("Point Of Sal Already Owned")
        return res.status(400).json({ message: "Point Of Sale Already Owned" });
    }

    const newUser = new User({
        base:{
        email, 
        username: userName,
        telephone,
        role:"RESTO_SUPER_ADMIN",
        avatar,
        password: await bcrypt.hash(password, 10)

        },
       ownerInfo:{ 
        businessName,
        ownedPos: [checkPointOfSale._id],
    }
    })
   
    await newUser.save();
    return res.status(201).json({message:"User Created Successfully", user: newUser});
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
    const {
        name,
        email, 
        username,  
        password, 
        telephone,
        avatar, 
        role,
        points, 
        preferences, 
        visitHistory

    } = req.body;
    console.log(email, username, password, telephone, preferences)

    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message: "User Already Exists in the database"});

    }

    // const checkPointOfSale = await PointOfSale.findOne({name: pointOfSaleName});

    // if(!checkPointOfSale){
    //     return res.status(400).json({message: "PointOf Sale Doesn Not Exsist"})
    // }
let prefsToSave = {
    //   notifications: true,
    //   emailUpdates: true,
      favoriteCuisines: []
    };

    if(Array.isArray(preferences)){
        prefsToSave.favoriteCuisines = preferences
    }
    const newUSer = new User({
       base: {
         name,
         email, 
        username,
        telephone,
        avatar,
        role,
        password: await bcrypt.hash(password, 10)
       },
       finalUser:{
  points,
        preferences:prefsToSave,
          visitHistory:{
            ...visitHistory
        },
       }
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
        const {section, updateData} = req.body;

        console.log('updateData',section, updateData)
        const updateObject ={
            [`${section}`]:updateData
        }
        console.log('updateObject',updateObject)
        if (section === "base" && updateData.password){ 
            updateData.password = await bcrypt.hash(updateData.password, 10)
        }
        const user = await User.findByIdAndUpdate({_id: id}, updateObject, {new: true});
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
      

        return res.status(200).json({ message: 'User updated successfully', data: user });  

    }catch(err){

    }
}

userController.settingsUpdateById= async (req, res, next)=>{
 const settingsSchema = z.object({
    username: z.string().min(2).max(50, "Name must be at least 2 characters").optional(),
    businessName: z.string().min(2).max(50, "Name must be at least 10 characters").optional(),
    email: z.string().email( "Invalid email address").optional(),
    telephone: z.string().regex(/^\+?\d{7,15}$/, "Invalid phone number").optional().or(z.literal("")),
    oldPassword: z.string().min(4, "Old password must be at least 6 chars").optional().or(z.literal("")),
    password: z.string().min(4, "New password must be at least 6 chars").optional().or(z.literal("")),
    settings: z.object({
        reviews_notifications: z.boolean().optional(),
        visits_notifications: z.boolean().optional(),
        weekly_report: z.boolean().optional(),
        // favoriteCuisines: z.array(z.string()).optional(),
      }).optional(),
  });
    try{
        const validateData = settingsSchema.parse(req.body.data);
        const {id}= req.params;
        // const updateData = req.body.data;
        console.log('updateData',validateData)
        // the body might have an unhashed password...we should hash it before updating
        Object.keys(validateData).forEach(key =>{
            if (validateData[key]=== "" || validateData[key]=== undefined || validateData[key] === null) {
                delete validateData[key]
            }   
        })
       if (!validateData.oldPassword && validateData.password){
           return res.status(400).json({message:"Please enter your old password"})
       }
       else if (validateData.oldPassword && validateData.password){
          const user = await User.findById({_id: id});
       const oldHashedPassword = user.password;
       console.log('old hashed password from DB',oldHashedPassword)
    //    console.log('hashOldPassword',hashOldPassword)

       const compareOldPassword = await bcrypt.compare(validateData.oldPassword, oldHashedPassword);
       if (!compareOldPassword){
           return res.status(400).json({message:"Old Password is incorrect"})
       }

    
        validateData.password = await bcrypt.hash(validateData.password, 10)
         delete validateData.oldPassword;

       }
     
        
        // console.log('hashed pass', validateData.password)
        // console.log('id', id, 'validateData', validateData)
        const updateUserData = await User.findByIdAndUpdate(id, validateData);

       
        return res.status(200).json({ message: 'User updated successfully', data: updateUserData });  

    }catch(err){
        

        next(err)
}}

userController.getUserById  = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById({_id:id});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User found', data: user });
    } catch (err) {
        next(err);
    }
};

userController.deleteUser = async(req, res, next)=>{

    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully', data: user });
}

module.exports = userController;