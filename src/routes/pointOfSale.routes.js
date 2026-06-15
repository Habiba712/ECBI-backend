 
 
 const router = require('express').Router();
const pointOfSaleController = require('../controllers/pointOfSale/pointOfSale.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roles.middleware');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage });

router.post('/addPointOfSale',upload.single('image'),pointOfSaleController.createPointOfSale);

router.get('/getPointOfSale/:name',  
    
    pointOfSaleController.getPointOfSaleByName);

router.get('/getPointsOfSaleByOwnerId/:id',  
    
    pointOfSaleController.getPointsOfSaleByOwnerId);



router.get('/getPointsOfSaleById/:id',  
    
    pointOfSaleController.getPointOfSaleById);


router.get('/getAllPointOfSale', 
    
    pointOfSaleController.getPointOfSale);

router.put('/updatePointOfSale/:id', 
    // authMiddleware,
    //  checkRole(["SUPER_ADMIN","RESTO_SUPER_ADMIN"]),
    pointOfSaleController.updatePointOfSale);

//we still need the delete route

router.delete('/deletePointOfSale/:id', 
    // authMiddleware,
    //  checkRole(["SUPER_ADMIN","RESTO_SUPER_ADMIN"]),
    pointOfSaleController.deletePointOfSale);

router.get('/getPointOfSaleQrCode/:id',
    // authMiddleware,
    pointOfSaleController.getPointOfSaleQrCode
);

router.put('/addReward/:id', 

    pointOfSaleController.addReward
)
// router.get('/archived', pointDeVenteController.getArchivedRestaurants);
// router.put('/archived-pointvente/:id', pointDeVenteController.archiveRestaurant)
// router.put('/unarchived-pointvente/:id', pointDeVenteController.unarchiveRestaurant)
 
module.exports = router;
