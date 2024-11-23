import express from 'express';
import {
  forgetPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from '../controller/auth.controller';
import {
  forgetPasswordValidator,
  loginUserDataValidator,
  registerUserDataValidator,
  resetPasswordValidator,
  verifyEmailValidator,
} from '../validator/auth.validator';
import { validateRequest } from '../middleware/validateRequest';

const authRouter = express.Router();

authRouter.post(
  '/register',
  registerUserDataValidator,
  validateRequest,
  register,
);
authRouter.post(
  '/verifyemail/:token',
  verifyEmailValidator,
  validateRequest,
  verifyEmail,
);
authRouter.post('/login', loginUserDataValidator, validateRequest, login);
authRouter.post('/logout', logout);
authRouter.post(
  '/forgetpassword',
  forgetPasswordValidator,
  validateRequest,
  forgetPassword,
);
authRouter.post(
  '/resetpassword/:token',
  resetPasswordValidator,
  validateRequest,
  resetPassword,
);

export default authRouter;
