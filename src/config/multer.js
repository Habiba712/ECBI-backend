
const multer = require('multer');

const uploadImage = multer({
  storage: multer.memoryStorage(), // Store file in memory instead of disk
  limits: {
    fileSize: 1024 * 1024 * 20, // Limit image size to 20MB
  },
  fileFilter: (req, file, callback) => {
    const typeFile = file.mimetype.split('/')[0];
    if (typeFile === 'image') {
      callback(null, true);
    } else {
      const err = new Error('Invalid image type');
      err.status = 401; // Unauthorized
      callback(err, false);
    }
  },
});


module.exports = uploadImage;
