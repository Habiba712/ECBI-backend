//? Simple skeleton for auth controller

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
 const { sendEmail } = require('../../utils/sendMail');
const Blacklist = require('../../models/Blacklist');

require('../../models/pointOfSale.model'); // Add this line to import the PointDeVente model

const authController = {};

authController.login = async(req, res, next) =>{
  
  try{
    const {email, password}= req.body;
    console.log('email',email)
    console.log('password',password)

    const user = await User?.findOne({ 
     $or:[
      {"base.email": email},
      {"ownerInfo.email":{email}}
     ]
    })
    console.log('user',user)
 if(!user){
      return res.status(401).json({message: 'User Not Found'})
    }
    if(user && user.base.role === 'RESTO_SUPER_ADMIN'){
      console.log('role',user.base.role)
      const getOwner = await User.findOne({_id: user._id}).populate('ownerInfo.ownedPos');
      console.log('getOwner',getOwner)
       const pointOfSaleName = getOwner?.ownerInfo?.ownedPos ? getOwner?.ownerInfo?.ownedPos[0]?.name: null;
    const businessName = getOwner?.ownerInfo?.businessName ? getOwner?.ownerInfo?.businessName: null;
    const role = user.base.role;

    const validatePassword = await bcrypt.compare(password, user.base.password);


    if(!validatePassword){
      return res.status(401).json({message: 'Invalid Credentials'})
    }


  

     const token = jwt.sign({
        email: user.email, 
        username: user.username,
        telephone: user.telephone,
        id: user._id,
        role,
        pointOfSaleName,
        businessName,
      },
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRATION})
 return res.json({message:'Login Succesful', token, role, pointOfSaleName, businessName, userId: user._id});
     }
     else{
          const role = user.base.role;

              const validatePassword = await bcrypt.compare(password, user.base.password);


    if(!validatePassword){
      return res.status(401).json({message: 'Invalid Credentials'})
    }


  

 const token = jwt.sign({
        email: user.email, 
        username: user.username,
        telephone: user.telephone,
        id: user._id,
        role
      },
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRATION})

      return  res.json({message:'Login Succesful', token, role, userId: user._id});
     }
   

   

   
    
  }catch(err){
    next(err)
  }

}



authController.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // expires in 15 minutes
    );

    const resetLink = `${process.env.FRONTEND_URL}/pages/password/reset?token=${token}`;

    // --- send email ---
    const html = `
    <p>You requested a password reset.</p>
    <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    <p>This link expires in 15 minutes.</p>
  `;
await sendEmail(email, "ECBI Password Reset", html);

    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};



authController.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token) return res.status(400).json({ message: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
console.log('password reset', newPassword)
    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


authController.logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    if (!authHeader) return res.sendStatus(204); // no token provided

    const token = authHeader; // Bearer <token>

    const checkIfBlacklisted = await Blacklist.findOne({ token });
    if (checkIfBlacklisted) return res.sendStatus(204);

    // blacklist the token
    const newBlacklist = new Blacklist({ token });
    await newBlacklist.save();

    res.status(200).json({ message: 'You are logged out!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = authController;

// exports.register = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     // add validation...
//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ email, password: hashed });
//     res.status(201).json({ id: user._id, email: user.email });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });
//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
//     const token = jwt.sign({ sub: user._id }, jwtSecret, { expiresIn: '7d' });
//     res.json({ token });
//   } catch (err) {
//     next(err);
//   }
// };