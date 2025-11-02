 
 
 const router = require('express').Router();
const pointOfSaleController = require('../controllers/pointOfSale/pointOfSale.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roles.middleware');

router.post('/addPointOfSale',
    authMiddleware,
      checkRole(["SUPER_ADMIN","RESTO_SUPER_ADMIN"]), 
     pointOfSaleController.createPointOfSale);

router.get('/getPointOfSale/:name',  
    
    pointOfSaleController.getPointOfSaleByName);


router.get('/getAllPointOfSale', 
    
    pointOfSaleController.getPointOfSale);

router.put('/updatePointOfSale/:id', 
    authMiddleware,
     checkRole(["SUPER_ADMIN","RESTO_SUPER_ADMIN"]),
    pointOfSaleController.updatePointOfSale);

//we still need the delete route
//TODO implement the delete route later

router.get('/getPointOfSaleQrCode/:id',
    authMiddleware,
    pointOfSaleController.getPointOfSaleQrCode
);

// router.get('/archived', pointDeVenteController.getArchivedRestaurants);
// router.put('/archived-pointvente/:id', pointDeVenteController.archiveRestaurant)
// router.put('/unarchived-pointvente/:id', pointDeVenteController.unarchiveRestaurant)
 
module.exports = router;
