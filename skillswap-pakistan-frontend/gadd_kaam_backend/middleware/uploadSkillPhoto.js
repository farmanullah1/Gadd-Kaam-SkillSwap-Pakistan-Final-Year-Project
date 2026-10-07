// middleware/uploadSkillPhoto.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create 'uploads/skill_photos' directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads', 'skill_photos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Files will be stored in a dedicated directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: fieldname-timestamp-userId.ext
    cb(null, `${file.fieldname}-${Date.now()}-${req.user.id}${path.extname(file.originalname)}`);
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

const uploadSkillPhoto = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
}).single('photo'); // 'photo' is the name of the form field for the file

module.exports = uploadSkillPhoto;
