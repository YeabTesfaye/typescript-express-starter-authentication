import { body, param } from 'express-validator';

const VALID_ROLES = ['ADMIN', 'USER'];

// Validation for retrieving a user by ID
export const validateGetUserById = [
  param('id')
    .exists().withMessage('User ID is required.')
    .isUUID().withMessage('Invalid User ID format.'),
];

// Validation for updating user data
export const validateUpdateUserData = [
  param('id')
    .exists().withMessage('User ID is required.')
    .isUUID().withMessage('Invalid User ID format.'),
  body('name')
    .optional()
    .isString().withMessage('Name must be a string.')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.'),
  body('email')
    .optional()
    .isEmail().withMessage('Provide a valid email address.'),
  body('bio')
    .optional()
    .isString().withMessage('Bio must be a string.'),
];

// Validation for updating user password
export const validateUpdateUserPassword = [
  param('id')
    .exists().withMessage('User ID is required.')
    .isUUID().withMessage('Invalid User ID format.'),
  body('oldPassword')
    .exists().withMessage('Old password is required.')
    .isString().withMessage('Old password must be a string.'),
  body('newPassword')
    .exists().withMessage('New password is required.')
    .isString().withMessage('New password must be a string.')
    .isStrongPassword().withMessage(
      'Password must include at least one uppercase letter, one number, and one symbol.',
    ),
];

// Validation for updating user role
export const validateUpdateUserRole = [
  param('id')
    .exists().withMessage('User ID is required.')
    .isUUID().withMessage('Invalid User ID format.'),
  body('role')
    .exists().withMessage('Role is required.')
    .isIn(VALID_ROLES).withMessage(`Role must be one of: ${VALID_ROLES.join(', ')}`),
];
