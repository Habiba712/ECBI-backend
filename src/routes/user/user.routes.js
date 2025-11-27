const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const checkRole = require('../../middlewares/roles.middleware');


router.post('/createOwner',
    // authMiddleware,
    // checkRole(['SUPER_ADMIN']),
    userController.createOwner
);

router.put('/updateOwner/:id',
    // authMiddleware,
    // checkRole(['SUPER_ADMIN']),
    userController.updateOwner
);

router.post('/register', 
  authMiddleware,
  checkRole(['SUPER_ADMIN']),
  userController.register);
// router.put('/:id', userController.updateUser);
// router.get('/:id/activate', userController.activateUser);
// router.get('/users', userController.getUsers);

router.put('/settingsUpdateById/:id',
  // authMiddleware, 
  // checkRole(['SUPER_ADMIN']), 
  userController.settingsUpdateById);
router.put('/updateUser/:id',
  // authMiddleware, 
  // checkRole(['SUPER_ADMIN']), 
  userController.updateUser);

router.get('/getUserById/:id',
  // authMiddleware, 
  // checkRole(['SUPER_ADMIN']),
   userController.getUserById);

router.delete('/deleteUser/:id',
  // authMiddleware, 
  // checkRole(['SUPER_ADMIN']),
   userController.deleteUser);
module.exports = router;

