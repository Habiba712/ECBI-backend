const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const checkRole = require('../../middlewares/roles.middleware');


router.post('/createOwner',
    authMiddleware,
    checkRole(['SUPER_ADMIN']),
    userController.createOwner
);

router.post('/register', 
  userController.register);
// router.put('/:id', userController.updateUser);
// router.get('/:id/activate', userController.activateUser);
// router.get('/users', userController.getUsers);


module.exports = router;

