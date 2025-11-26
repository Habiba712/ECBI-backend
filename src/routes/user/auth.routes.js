//? skeleton for auth routes

const express = require('express');
const router = express.Router();
const authCtrl = require('../../controllers/user/auth.controller');

// router.post('/register', authCtrl.register);
router.post('/login', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://ecbi-frontend-9ww4.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  authCtrl.login, 
  next();
}
);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);
router.post('/logout', authCtrl.logout);
module.exports = router;