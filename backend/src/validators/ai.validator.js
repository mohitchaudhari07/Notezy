const { param } = require('express-validator');

const generateSummaryValidator = [
  param('resourceId')
    .isMongoId()
    .withMessage('Invalid Resource Mongo ID')
];

module.exports = {
  generateSummaryValidator
};
