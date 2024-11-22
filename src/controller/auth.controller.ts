import { Request, Response } from 'express';
import prisma from '../configs/db';
import { StatusCodes } from 'http-status-codes';
import BadRequestError from '../errors/bad-request';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/mailer';
import UnauthenticatedError from '../errors/unauthenticated';
import { generateVerificationCode } from '../utils/generateVerificationCode';
import { createToken } from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';
import { UserData } from '../intefaces/auth';

export const register = async (
  req: Request<{}, {}, UserData>,
  res: Response,
) => {
  const { name, email, password, bio } = req.body;

  // this is just for ts
  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all required fields');
  }
  // Check if email is already taken
  const isEmailExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (isEmailExist) {
    throw new BadRequestError('Email is already registered!');
  }

  // Set the first registered user as an admin
  const isFirstAccount = await prisma.user.count();
  const role = isFirstAccount == 0 ? 'ADMIN' : 'USER';

  // Hashing the password
  const salt = await bcrypt.genSalt();
  if (!password) {
    throw new BadRequestError('Password is required!');
  }
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      bio: bio ?? null,
      role: role,
    },
  });

  res.status(StatusCodes.CREATED).json({
    message: 'User Created Sucesfully!',
  });
};

export const verifyUser = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  // Check if the user exist and if the code matches
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // update the user status
  // await prisma.user.update({
  //   where: { email },
  //   data: {
  //     status: 'ACTIVE',
  //     verificationCode: undefined,
  //   },
  // });
  res.status(StatusCodes.OK).json({ message: 'Account verified successfully' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide valid email and password!');
  }

  // Check if the email avaliable
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credintials');
  }

  // Comparing password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credintials');
  }
  // if (user.status === 'PENDING') {
  //   throw new BadRequestError('Please active your account!');
  // }

  // Generate Token
  const tokenUser = createToken(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1 * 1000),
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: 'User has been logged out successfully !!' });
};
