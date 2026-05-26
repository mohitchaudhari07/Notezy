const { body, param, query } = require('express-validator');
const { RESOURCE_TYPES, EXAM_TYPES, SEMESTERS } = require('../utils/constants');

const createUniversityValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('University name is required'),
  body('shortName')
    .optional()
    .trim()
];

const createBranchValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Branch name is required'),
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Branch code is required (e.g., CSE)'),
  body('university')
    .isMongoId()
    .withMessage('Invalid University Mongo ID')
];

const createSubjectValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Subject name is required'),
  body('code')
    .trim()
    .notEmpty()
    .withMessage('Subject code is required'),
  body('semester')
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be between 1 and 8'),
  body('branch')
    .isMongoId()
    .withMessage('Invalid Branch Mongo ID'),
  body('university')
    .isMongoId()
    .withMessage('Invalid University Mongo ID')
];

const uploadResourceValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Resource title is required'),
  body('type')
    .isIn(Object.values(RESOURCE_TYPES))
    .withMessage(`Type must be one of: ${Object.values(RESOURCE_TYPES).join(', ')}`),
  body('examType')
    .optional()
    .isIn(Object.values(EXAM_TYPES))
    .withMessage(`Exam type must be one of: ${Object.values(EXAM_TYPES).join(', ')}`),
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Please provide a valid year (YYYY)'),
  body('semester')
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be between 1 and 8'),
  body('subject')
    .isMongoId()
    .withMessage('Invalid Subject Mongo ID'),
  body('branch')
    .isMongoId()
    .withMessage('Invalid Branch Mongo ID'),
  body('university')
    .isMongoId()
    .withMessage('Invalid University Mongo ID')
];

module.exports = {
  createUniversityValidator,
  createBranchValidator,
  createSubjectValidator,
  uploadResourceValidator
};
