import { body } from 'express-validator';

export const registerUserDataValidator = [
  // Validate 'name'
  body('name')
    .exists()
    .withMessage('Name is required.')
    .isString()
    .withMessage('Name must be a string.')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long.'),

  // Validate 'email'
  body('email')
    .exists()
    .withMessage('Email is required.')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Provide a valid email.'),

  // Validate 'password'
  body('password')
    .exists()
    .withMessage('Password is required.')
    .isString()
    .withMessage('Password must be a string.')
    .isStrongPassword()
    .withMessage(
      'Password must be strong, including at least 1 uppercase letter, 1 number, and 1 symbol.',
    ),

  // 'role' and 'status' are not required and will take default values if not provided
  // No validation is needed for 'role' and 'status' since Prisma will handle the default values
  // But if you want to validate them when provided, you can do so as follows:

  body('role')
    .optional()
    .isIn(['ADMIN', 'USER'])
    .withMessage("Role must be either 'ADMIN' or 'USER'"),

  body('status')
    .optional()
    .isIn(['PENDING', 'ACTIVE'])
    .withMessage("Status must be either 'PENDING' or 'ACTIVE'"),
];

export const loginUserDataValidator = [
  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide valid email address'),
  body('password').exists().withMessage('Password is required'),
];
