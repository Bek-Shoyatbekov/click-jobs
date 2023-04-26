//require the fs module
const fs = require('fs');

//define a function to delete a file
function deleteFile(path) {
    //use fs.unlink() to delete the file
    fs.unlink(path, (err) => {
        //handle any errors
        if (err) {
            return false;
        }
        //log success message
        return true;
    });
}

module.exports = deleteFile;