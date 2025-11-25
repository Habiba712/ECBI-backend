const express = require('express');
const router = express.Router();

const health = require('../controllers/health.controller');
const authRoutes = require('./user/auth.routes');
const userRoutes = require('./user/user.routes');
const pointOfSaleRoutes = require('../routes/pointOfSale.routes');
 const reviewsRoutes = require('../routes/reviews.routes');
const authMiddleware = require('../middlewares/auth.middleware');
const postRoutes = require('../routes/post.routes');
// const pointOfSaleRouter = require('./pointsdeventes.routes');

//public routes
router.get('/health', health.ping);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/reviews', reviewsRoutes);

//protected routes
router.use('/pointOfSale', pointOfSaleRoutes);
router.use('/post', postRoutes);
// router.use('/pointDeVente', pointsDeVentesRoutes);


module.exports = router;