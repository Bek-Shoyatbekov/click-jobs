const express = require('express');

const User = require('../controllers/user');

const router = express.Router();


router.get('/profile', User.getProfile);


router.post('/profile', User.updateProfile);








module.exports = router;