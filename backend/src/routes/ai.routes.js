const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const verifyJWT = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { generateSummaryValidator } = require('../validators/ai.validator');

// Secure all AI paths with JWT authentication
router.use(verifyJWT);

router.post('/summary/:resourceId', generateSummaryValidator, validate, aiController.generateSummary);
router.get('/summary/:resourceId', generateSummaryValidator, validate, aiController.getSummary);

module.exports = router;
