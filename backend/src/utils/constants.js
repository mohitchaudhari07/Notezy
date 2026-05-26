const ROLES = Object.freeze({
  STUDENT: 'student',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
});

const RESOURCE_TYPES = Object.freeze({
  PYQ: 'PYQ',
  NOTES: 'Notes',
  SYLLABUS: 'Syllabus'
});

const EXAM_TYPES = Object.freeze({
  MID_SEM: 'Mid-Sem',
  END_SEM: 'End-Sem',
  SESSIONAL: 'Sessional',
  OTHER: 'Other'
});

const SEMESTERS = Object.freeze({
  SEM1: 1,
  SEM2: 2,
  SEM3: 3,
  SEM4: 4,
  SEM5: 5,
  SEM6: 6,
  SEM7: 7,
  SEM8: 8
});

module.exports = {
  ROLES,
  RESOURCE_TYPES,
  EXAM_TYPES,
  SEMESTERS
};
