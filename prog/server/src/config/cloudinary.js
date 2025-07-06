const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.v2.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

module.exports = cloudinary.v2;