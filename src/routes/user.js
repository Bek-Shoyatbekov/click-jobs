const express = require('express');

const User = require('../controllers/user');

const router = express.Router();

const cpUpload = require('../utils/file_upload_service/setup');

const isAuth = require('../middlewares/auth/authenticateToken');

router.get('/profile', isAuth, User.getProfile);

// TODO Pay attention if user upload files again and again , your server can be crashed because there will be tone of files in uploads folder

router.post('/profile', isAuth, cpUpload, User.updateProfile);


router.post('/req', isAuth, User.sendReq);






module.exports = router;