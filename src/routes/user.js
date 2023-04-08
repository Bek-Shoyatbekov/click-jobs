const express = require('express');

const User = require('../controllers/user');

const router = express.Router();

const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({
    storage: storage
});

const cpUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]);


router.get('/profile/:userId', User.getProfile);



router.put('/profile/:userId', User.updateProfile);





module.exports = router;