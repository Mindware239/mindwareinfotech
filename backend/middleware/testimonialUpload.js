const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads/testimonials directory exists
const testimonialsUploadDir = path.join(__dirname, '../uploads/testimonials');
if (!fs.existsSync(testimonialsUploadDir)) {
  fs.mkdirSync(testimonialsUploadDir, { recursive: true });
}

// Configure multer for testimonial image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, testimonialsUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = `testimonial-${uniqueSuffix}${fileExtension}`;
    cb(null, fileName);
  }
});

// File filter for testimonial images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed for testimonial images'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB limit for testimonials
  },
  fileFilter: fileFilter
});

// Upload single testimonial image
const uploadTestimonialImage = upload.single('client_image');

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 3MB.'
      });
    }
  }
  
  if (error.message.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Cleanup function to remove uploaded files on error
const cleanupUploads = (req, res, next) => {
  if (req.file) {
    const filePath = path.join(testimonialsUploadDir, req.file.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  next();
};

module.exports = {
  uploadTestimonialImage,
  handleUploadError,
  cleanupUploads
};
