const router = require('express').Router();
const reviewsController = require('../controllers/reviews/reviews.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roles.middleware');


router.post('/createReview',
    //  authMiddleware,

     reviewsController.createReview
)

router.get('/getAllReviews', 
    // authMiddleware,
    // checkRole(['SUPER_ADMIN']),
    reviewsController.getAllReviews

)

router.put('/updateReviews/:id',
    // authMiddleware,
    // checkRole(['SUPER_ADMIN']),
    reviewsController.updateReviews
)
module.exports = router;