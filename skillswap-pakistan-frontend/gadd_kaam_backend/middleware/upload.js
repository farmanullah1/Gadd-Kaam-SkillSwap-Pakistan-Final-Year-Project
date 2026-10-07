// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create 'uploads' directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be stored in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    // Keep it simple: fieldname-timestamp.ext for initial unique save
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
});

// Export a configured multer instance for multiple files
module.exports = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'cnicFrontPicture', maxCount: 1 },
  { name: 'cnicBackPicture', maxCount: 1 },
]);