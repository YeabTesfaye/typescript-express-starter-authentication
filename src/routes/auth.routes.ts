import express from 'express';
import { forgetPassword, login, logout, register, resetPassword, verifyEmail } from '../controller/auth.controller';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/verifyemail/:token', verifyEmail);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/forgetPassword', forgetPassword);
authRouter.post('/resetpassword/:token', resetPassword);

export default authRouter;