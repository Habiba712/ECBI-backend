const router = require('express').Router();
const notifController = require('../controllers/notifications/notif.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/roles.middleware');

router.get('/getByReceipient/:userId', notifController.getByReceipient);

router.post('/createNotification', 
    authMiddleware,
    // checkRole(["SUPER_ADMIN","RESTO_SUPER_ADMIN"]),
    notifController.createNotification);
router.put('/markAsRead/:notifId',
    authMiddleware,
    // checkRole(["SUPER_ADMIN","RESTO_SUPER_ADMIN"]),
    notifController.markAsRead);
router.delete('/deleteNotification/:notifId',
    authMiddleware,
    // checkRole(["SUPER_ADMIN","RESTO_SUPER_ADMIN"]),
    notifController.deleteNotification);

module.exports = router;