const express = require('express');


const router = express.Router();

const upload = require('../utils/file_upload_service/setup');

const isAuth = require('../middlewares/auth/authenticateToken');
const ContentController = require('../controllers/content');
const UserController = require('../controllers/user');

router.get('/profile', isAuth, UserController.getProfile);

// TODO Pay attention if user upload files again and again , your server can be crashed because there will be tone of files in uploads folder

router.post('/profile', isAuth, UserController.updateProfile);

router.post('/req', isAuth, UserController.sendReq);

router.get('/myjobs', isAuth, ContentController.getAllJob);

router.get('/jobs', UserController.search);

router.put('/apply/:jobId', isAuth, UserController.applyJob);

router.get('/applications', isAuth, UserController.myApplications);

router.put('/save/:jobId', isAuth, UserController.saveJob);

router.post('/image', isAuth, upload.single('image'), UserController.uploadImage);

router.post('/resume', isAuth, upload.single('resume'), UserController.uploadResume);






module.exports = router;