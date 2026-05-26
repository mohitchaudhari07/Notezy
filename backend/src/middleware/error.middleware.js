const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, cast it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  // Handle Mongoose duplicate key errors
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    const message = `Duplicate value error: ${field} already exists.`;
    error = new ApiError(409, message);
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid authentication token.');
  }
  if (error.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Authentication token has expired.');
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
  };

  // Log error console logs in development or if it's a 500 error
  if (process.env.NODE_ENV === 'development' || error.statusCode === 500) {
    console.error(`\n[API Error] ${req.method} ${req.originalUrl} - Status: ${error.statusCode}`);
    console.error(err);
  }

  return res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
