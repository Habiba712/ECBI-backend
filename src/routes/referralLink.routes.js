const express = require('express');
const router = require('express').Router();


const referralLinkController = require('../controllers/referralLink/referralLink.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roles.middleware');
router.post('/createReferralLink',
    // authMiddleware,
    // checkRole(['SUPER_ADMIN']),
    referralLinkController.createReferralLink
);
router.get('/getReferralLinkByLink/:linkId',
    referralLinkController.getReferralLinkByLink
);

router.get('/getAllReferralLinks',
    // authMiddleware,
    // checkRole(['SUPER_ADMIN']),
    referralLinkController.findReferralLinkForModal
);

module.exports = router;

// https://ecbi-backend.onrender.com/api/referralLink/getReferralLinkByLink/29qe5voh