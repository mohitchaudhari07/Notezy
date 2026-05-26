const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

// Using standard disk storage inside temp workspace folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save inside temporary directory inside backend folder (safe from outside root workspace)
    const tempDir = path.join(__dirname, '../../public/temp');
    // Multer will require this directory to exist, or we can use memoryStorage
    // For cloud uploads, memory storage is highly efficient and premium as it doesn't leave stray local files
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// For premium zero-disk-footprint architecture, let's configure standard memoryStorage
const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only PDF and Image formats (PNG, JPG, JPEG) are allowed.'), false);
  }
};

// Limit file size to 10MB
const upload = multer({
  storage: memoryStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;
