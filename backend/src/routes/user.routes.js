const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyJWT = require('../middleware/auth.middleware');

// Apply auth middleware to all profile/bookmark operations
router.use(verifyJWT);

router.put('/profile', userController.updateProfile);
router.post('/bookmarks', userController.bookmarkResource);
router.get('/bookmarks', userController.getBookmarkedResources);
router.get('/downloads', userController.getDownloadHistory);
router.post('/downloads', userController.recordDownload);

module.exports = router;
