const Enquiry = require('../models/Enquiry');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * Submits a new contact/enquiry message and saves it to the database
 */
const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic server-side verification
  if (!name || !name.trim()) {
    throw new ApiError(400, 'Name is required');
  }
  if (!email || !email.trim()) {
    throw new ApiError(400, 'Email is required');
  }
  if (!subject || !subject.trim()) {
    throw new ApiError(400, 'Subject is required');
  }
  if (!message || !message.trim()) {
    throw new ApiError(400, 'Message is required');
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new ApiError(400, 'Invalid email address format');
  }

  // Create the enquiry in the database
  const enquiry = await Enquiry.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim()
  });

  return res
    .status(251) // Standard 201 Created or custom response status
    .json(new ApiResponse(201, enquiry, 'Enquiry submitted successfully'));
});

module.exports = {
  createEnquiry
};
