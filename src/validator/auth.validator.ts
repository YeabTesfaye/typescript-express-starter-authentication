import { body, param } from 'express-validator';

export const registerUserDataValidator = [
  // Validate 'name'
  body('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required.')
    .isString()
    .withMessage('Name must be a string.')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters long.'),

  // Validate 'email'
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required.')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Provide a valid email address.'),

  // Validate 'password'
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.')
    .isString()
    .withMessage('Password must be a string.')
    .isStrongPassword()
    .withMessage(
      'Password must be strong, including at least 1 uppercase letter, 1 number, and 1 symbol.',
    ),

  // Validate 'role' (optional)
  body('role')
    .optional()
    .isIn(['ADMIN', 'USER'])
    .withMessage("Role must be either 'ADMIN' or 'USER'."),

  // Validate 'bio' (optional)
  body('bio')
    .optional()
    .isString()
    .withMessage('Bio must be a string.')
    .isLength({ max: 255 })
    .withMessage('Bio cannot exceed 255 characters.'),

  // Validate 'gender' (required)
  body('gender')
    .exists({ checkFalsy: true })
    .withMessage('Gender is required.')
    .isIn(['Male', 'Female'])
    .withMessage("Gender must be either 'Male' or 'FEMALE'"),

  // Validate 'age' (required)
  body('age')
    .exists({ checkFalsy: true })
    .withMessage('Age is required.')
    .isInt({ min: 3 })
    .withMessage('Age must be a number and at least 18.'),

  // Validate 'profileImage' (optional)
  body('profileImage')
    .optional()
    .isURL()
    .withMessage('Profile Image must be a valid URL.'),

  // Validate 'isEmailVerified' (optional, Prisma handles defaults)
  body('isEmailVerified')
    .optional()
    .isBoolean()
    .withMessage('Email verification status must be a boolean.'),
];

export const loginUserDataValidator = [
  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Provide valid email address'),
  body('password').exists().withMessage('Password is required'),
];

export const resetPasswordValidator = [
  // Validate the 'password' field
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required.')
    .isString()
    .withMessage('Password must be a string.')
    .isStrongPassword()
    .withMessage(
      'Password must be strong, including at least 1 uppercase letter, 1 number, and 1 symbol.',
    ),

  // Validate the 'token' parameter
  param('token')
    .exists({ checkFalsy: true })
    .withMessage('Token is required.')
    .isString()
    .withMessage('Token must be a valid string.'),
];

export const forgetPasswordValidator = [
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Provide a valid email address.'),
];

export const verifyEmailValidator = [
  param('token')
    .exists({ checkFalsy: true })
    .withMessage('Token is required.')
    .isString()
    .withMessage('Token must be a valid string.'),
];
