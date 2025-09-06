const express = require('express');
const {
  generateCertificate,
  getCertificate,
  verifyCertificate,
  getMyCertificates,
  getCertificates,
  revokeCertificate
} = require('../controllers/certificateController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/verify/:code', verifyCertificate);

// Protected routes
router.get('/my-certificates', protect, getMyCertificates);
router.get('/:id', protect, validateObjectId('id'), getCertificate);

// Admin/Instructor routes
router.post('/generate', protect, authorize('admin', 'instructor'), generateCertificate);
router.get('/', protect, authorize('admin'), validatePagination, getCertificates);
router.put('/:id/revoke', protect, authorize('admin'), validateObjectId('id'), revokeCertificate);

module.exports = router;
