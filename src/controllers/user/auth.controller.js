//? Simple skeleton for auth controller

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
 const { sendEmail } = require('../../utils/sendMail');

require('../../models/pointOfSale.model'); // Add this line to import the PointDeVente model

const authController = {};

authController.login = async(req, res, next) =>{
  try{
    const {email, password}= req.body;

    const user = await User?.findOne({ 
     email
    }).populate('pointOfSale');

    if(!user){
      return res.status(401).json({message: 'User Not Found'})
    }
    //in case the user is found, we need to validate the password

    const validatePassword = await bcrypt.compare(password, user.password);


    if(!validatePassword){
      return res.status(401).json({message: 'Invalid Credentials'})
    }

    const pointOfSaleName = user?.pointOfSale ? user?.pointOfSale?.name: null;
    const businessName = user?.businessName ? user?.businessName: null;
  
    const role = user.role;
      //we have to generate the token if the password is valid

      const token = jwt.sign({
        email: user.email, 
        username: user.username,
        telephone: user.telephone,
        role,
        pointOfSaleName,
        businessName,
        id: user._id
        
      },
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRATION})
    

    res.json({message:'Login Succesful', token, role, pointOfSaleName, businessName, userId: user._id});
    
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