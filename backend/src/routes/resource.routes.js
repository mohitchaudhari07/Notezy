const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');
const verifyJWT = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const validate = require('../middleware/validate.middleware');
const { uploadResourceValidator } = require('../validators/resource.validator');

// Public route to search or list study resources
router.get('/', resourceController.listResources);

// Protected routes (Student or admin permissions)
router.post(
  '/upload',
  verifyJWT,
  upload.single('file'), // Multer parses single file field named 'file'
  uploadResourceValidator,
  validate,
  resourceController.uploadResource
);

// Catalog routes for hierarchy
router.get('/catalog/universities', resourceController.getCatalogUniversities);
router.get('/catalog/streams', resourceController.getCatalogStreams);
router.get('/catalog/subjects', resourceController.getCatalogSubjects);
router.get('/catalog/papers', resourceController.getCatalogPapers);
router.get('/catalog/search', resourceController.searchCatalogPapers);
router.get('/catalog/papers/:id', resourceController.getCatalogPaperDetails);

router.get('/:id', verifyJWT, resourceController.getResourceDetails);
router.get('/:id/download', verifyJWT, resourceController.downloadResource);

module.exports = router;
