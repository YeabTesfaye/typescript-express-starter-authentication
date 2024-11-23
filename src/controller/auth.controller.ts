import { Request, Response, RequestHandler } from 'express';
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
import NotFoundError from '../errors/not-found';
import crypto from 'crypto';
import { Gender } from '@prisma/client';
import nodemailer from 'nodemailer';

export const register = async (
  req: Request<{}, {}, UserData>,
  res: Response,
) => {
  const { name, email, password, bio, gender, age } = req.body;

  // Validation for required fields
  if (!name || !email || !password || !gender || !age) {
    throw new BadRequestError('Please provide all required fields');
  }

  // Ensure gender matches the allowed enum values
  if (!Object.values(Gender).includes(gender as Gender)) {
    throw new BadRequestError(
      `Invalid gender. Allowed values: ${Object.values(Gender).join(', ')}`,
    );
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
  const hashedPassword: string = await bcrypt.hash(password, salt);

  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      bio: bio ?? null,
      gender: gender as Gender,
      age: parseInt(age, 10),
      role,
      verificationToken,
    },
  });

  const verificationUrl =
    process.env.CLIENT_URL + '/verifyemail' + `/${verificationToken}`;

  // Use the email utility function
  /*
  await sendEmail({
    to: email,
    subject: 'Email Verification',
    html: `
       <h3>Verify your Email</h3>
       <a href=${verificationUrl}>${verificationUrl}</a>
     `,
  });
  */

  res.status(200).json({
    id: user.id,
    link: verificationUrl,
  });
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
  if (user.isEmailVerified === false) {
    throw new BadRequestError('Please verify your email!');
  }

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

// Forget Password
export const forgetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    new NotFoundError(`User with email ${email} doesn't exist !!`);
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Expires after one hour

  await prisma.passWordReset.create({
    data: {
      email,
      token,
      expires,
    },
  });
  const link = process.env.CLIENT_URL + '/resetpassword' + `/${token}`;

  // SEND EMAIL
  /*
  await sendEmail({
    to: email,
    subject: 'Password Reset',
    html: `
      <h3>Reset your Password</h3>
      <a href=${link}>${link}</a>
    `,
  });
  */
  res.status(StatusCodes.OK).json({
    message: `Password reset email sent ${link}`,
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    throw new BadRequestError('A password field is required');
  }

  const { token } = req.params;
  const passwordReset = await prisma.passWordReset.findFirst({
    where: { token },
  });

  if (!passwordReset) {
    throw new BadRequestError('Invalid token');
  }

  if (passwordReset.expires < new Date()) {
    throw new BadRequestError('Token has expired');
  }

  const user = await prisma.user.findUnique({
    where: { email: passwordReset.email },
  });

  if (!user) {
    throw new BadRequestError(
      `User with email ${passwordReset.email} does not exist.`,
    );
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    // Update the user's password
    await prisma.user.update({
      where: { email: passwordReset.email },
      data: { password: hashedPassword },
    });

    // Delete the password reset record
    await prisma.passWordReset.deleteMany({
      where: { token, email: passwordReset.email },
    });

    res.status(StatusCodes.OK).json({
      message: 'The password has been updated successfully!',
    });
  } catch (error) {
    console.error('Failed to reset password:', error);
    throw new Error('An error occurred while resetting the password.');
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
    },
  });

  if (!user) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Invalid Verification Token' });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      verificationToken: '',
    },
  });

  res.status(200).json({ msg: 'Email Verified' });
};
