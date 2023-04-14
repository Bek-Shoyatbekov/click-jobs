const User = require('../controllers/user');

const ContentController = require('../controllers/content');

const isAuth = require('../middlewares/auth/authenticateToken');


const router = require('express').Router();

router.post('/add', isAuth, ContentController.createJob);

router.get('/all', isAuth, ContentController.getAllJob);



module.exports = router;