// const multer = require('multer');
// const path = require('path');

// // sotrage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// //file filter to accept only

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only images are allowed'), false);
//   }
// };

// // Multer middleware
// const upload = multer({ storage, fileFilter });

// module.exports = upload;

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// console.log(process.env.CLOUD_NAME);
// Set up storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'travel_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });

module.exports = upload;
