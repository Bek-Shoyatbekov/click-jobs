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




var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Define the allowed types
        const ALLOWED_TYPES = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/tiff',
            'application/pdf'
        ];
        // Check if the file type is in the list
        if (ALLOWED_TYPES.includes(file.mimetype)) {
            // Accept the file
            cb(null, true);
        } else {
            // Reject the file
            cb(null, false);
        }
    }
})

const cpUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]);


router.get('/profile/:userId', User.getProfile);



router.put('/profile/:userId', cpUpload, User.updateProfile);





module.exports = router;