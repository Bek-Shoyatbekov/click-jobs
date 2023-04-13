const adminContoller = require('../controllers/admin')

const isAuth = require('../middlewares/auth/authenticateToken');


const router = require('express').Router()

router.get('/requests', isAuth, adminContoller.getAllRequests);

module.exports = router