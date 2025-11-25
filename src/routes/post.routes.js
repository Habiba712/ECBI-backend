 
const express = require('express');
 
 const router = require('express').Router();

const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roles.middleware');
const postController = require('../controllers/posts/post.controller');
const multer = require('multer');
const storage = multer.memoryStorage(); // store in memory to send to cloudinary
const upload = multer({ storage });

router.post('/scanQr', postController.scanQr
);
router.post('/createPost',upload.single('image'), postController.createPost
    //  authMiddleware, 
    //  checkRole(['SUPER_ADMIN']),
);

// router.get('/getPointOfSale/:name',  
    
//     pointOfSaleController.getPointOfSaleByName);

// router.get('/getPointsOfSaleByOwnerId/:id',  
    
//     pointOfSaleController.getPointsOfSaleByOwnerId);

module.exports = router;
