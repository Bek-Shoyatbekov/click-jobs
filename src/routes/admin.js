const adminController = require('../controllers/admin')

const isAuth = require('../middlewares/auth/authenticateToken');


const router = require('express').Router()

router.get('/requests', isAuth, adminController.getAllRequests);

router.get('/users', isAuth, adminController.getAllUsers);

router.get('/user/:userId', isAuth, adminController.getUserById)

router.put('/users/:id', isAuth, adminController.updateUserById);

router.get('/jobs', isAuth, adminController.getAllContent);

router.put('/jobs/:jobId', isAuth, adminController.updateContentById);

router.get('/jobs/:jobId', isAuth, adminController.findOneJobById);

module.exports = router