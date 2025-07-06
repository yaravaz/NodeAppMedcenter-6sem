const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary.js');

const courseImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'doctors',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const uploadCourseImage = multer({ storage: courseImageStorage });

module.exports = uploadCourseImage;