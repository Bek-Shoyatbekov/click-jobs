const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './src/public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[file.originalname.split(".").length - 1]);
    }
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 mb
    },
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
    { name: 'image', maxCount: 5 },
    { name: 'resume', maxCount: 1 }
]);

module.exports = cpUpload;