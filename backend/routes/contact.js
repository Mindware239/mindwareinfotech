const express = require('express');
const router = express.Router();
const { sendBrochureRequest } = require('../controllers/contactController');

// POST /api/contact/brochure-request
router.post('/brochure-request', sendBrochureRequest);

module.exports = router;
