const adminController = require('../controllers/admin')

const isAuth = require('../middlewares/auth/authenticateToken');


const router = require('express').Router()

router.get('/requests', isAuth, adminController.getAllRequests);

router.get('/users', isAuth, adminController.getAllUsers);

router.put('/users/:id', isAuth, adminController.updateUserById);



module.exports = router