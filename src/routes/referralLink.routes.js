const express = require('express');
const router = require('express').Router();


const referralLinkController = require('../controllers/referralLink/referralLink.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roles.middleware');
router.post('/createReferralLink',
    // authMiddleware,
    // checkRole(['SUPER_ADMIN']),
    referralLinkController.createReferralLink
)

module.exports = router;