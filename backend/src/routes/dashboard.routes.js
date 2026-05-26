const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const verifyJWT = require('../middleware/auth.middleware');
const authorizeRoles = require('../middleware/role.middleware');
const { ROLES } = require('../utils/constants');

// Route restricted to admin and moderators for security
router.get(
  '/stats',
  verifyJWT,
  authorizeRoles(ROLES.ADMIN, ROLES.MODERATOR, ROLES.STUDENT),
  dashboardController.getDashboardStats
);

module.exports = router;
