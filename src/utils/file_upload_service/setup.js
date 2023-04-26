const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        //specify the destination folder
        callback(null, './src/public/uploads');
    },
    filename: function (req, file, callback) {
        //access the original name of the file
        const originalName = file.originalname;
        //modify the name as you wish
        const modifiedName = Date.now() + '-' + originalName.replaceAll(' ', ''); //add a timestamp
        //pass the modified name to the callback
        callback(null, modifiedName);
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


module.exports = upload;