//? skeleton for auth routes

const express = require('express');
const router = express.Router();
const authCtrl = require('../../controllers/user/auth.controller');

// router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', authCtrl.resetPassword);
router.post('/logout', authCtrl.logout);
module.exports = router;