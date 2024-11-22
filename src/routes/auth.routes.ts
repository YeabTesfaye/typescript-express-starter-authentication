import express from 'express';
import { login, logout, register, verifyUser } from '../controller/auth.controller';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/verfiy', verifyUser);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;