import express from 'express';
import {
  DeletUser,
  getAllUsers,
  getUserById,
  updateUserData,
  updateUserPassword,
  updateUserRole,
} from '../controller/user.controller';
import {
  authenticatedUser,
  authorizePermissions,
} from '../middleware/authentication';
import {
  validateGetUserById,
  validateUpdateUserData,
  validateUpdateUserPassword,
  validateUpdateUserRole,
} from '../validator/user.validator';
import { validateRequest } from '../middleware/validateRequest';

const userRoutes = express.Router();

userRoutes.route('/').get(getAllUsers);
// Update user password with validation
userRoutes
  .route('/:id/updatePassword')
  .patch(
    [authenticatedUser],
    validateUpdateUserPassword,
    validateRequest,
    updateUserPassword,
  );
// Update user role with validation and admin authorization
userRoutes
  .route('/:id/updateRole')
  .patch(
    [authenticatedUser, authorizePermissions('ADMIN')],
    validateUpdateUserRole,
    validateRequest,
    updateUserRole,
  );

// Get single user by Id
userRoutes.route('/:id').get(validateGetUserById, validateRequest, getUserById);

// Update user Data
userRoutes
  .route('/:id')
  .patch(
    [authenticatedUser],
    validateUpdateUserData,
    validateRequest,
    updateUserData,
  );

// Delete User
userRoutes
  .route('/:id')
  .delete([authenticatedUser, authorizePermissions('ADMIN')], DeletUser);
export default userRoutes;
