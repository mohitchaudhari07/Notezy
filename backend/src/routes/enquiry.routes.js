const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiry.controller');

// Public route to submit an enquiry from the contact form
router.post('/', enquiryController.createEnquiry);

module.exports = router;
