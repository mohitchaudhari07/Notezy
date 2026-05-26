const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path || err.param]: err.msg }));
  
  throw new ApiError(400, 'Validation failed for request parameters', extractedErrors);
};

module.exports = validate;
