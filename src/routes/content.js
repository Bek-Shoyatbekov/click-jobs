const User = require('../controllers/user');

const ContentController = require('../controllers/content');

const isAuth = require('../middlewares/auth/authenticateToken');


const router = require('express').Router();

router.post('/add', isAuth, ContentController.createJob);

router.get('/all', isAuth, ContentController.getAllJob);

router.put('/update/:jobId', isAuth, ContentController.updateById);

router.delete('/delete/:jobId', isAuth, ContentController.deleteById);



module.exports = router;