const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  getActiveBannersByType,
  updateBannerPosition,
  toggleBannerStatus
} = require('../controllers/bannerController');

const { protect, authorize } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Configure multer for banner uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/banners/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Public routes
router.get('/', validatePagination, getBanners);
router.get('/active/:type', getActiveBannersByType);
router.get('/:id', validateObjectId, getBanner);

// Admin routes (temporarily removing auth for testing)
// router.use(protect);
// router.use(authorize('admin'));

router.post('/', upload.single('image'), createBanner);
router.put('/:id', validateObjectId, upload.single('image'), updateBanner);
router.delete('/:id', validateObjectId, deleteBanner);
router.put('/:id/position', validateObjectId, updateBannerPosition);
router.put('/:id/toggle', validateObjectId, toggleBannerStatus);

module.exports = router;
