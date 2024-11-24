import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../configs/db';
import { StatusCodes } from 'http-status-codes';
import NotFoundError from '../errors/not-found';
import UnauthorizedError from '../errors/anauthorized';
import { checkPermission, UserRole } from '../errors/checkPermission';
import UpdateData from '../intefaces/user';
import { createToken } from '../utils/createTokenUser';
import { attachCookiesToResponse } from '../utils/jwt';
import BadRequestError from '../errors/bad-request';
import { UploadedFile } from 'express-fileupload';
import cloudinary from '../configs/cloudinary.config';
import fs from 'fs';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      bio: true,
      age: true,
      gender: true,
      isEmailVerified: true,
      created_at: true,
      updated_at: true,
    },
  });
  res.status(StatusCodes.OK).json({ users });
};

export const getUserById = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      age: true,
      gender: true,
      isEmailVerified: true,
      created_at: true,
      updated_at: true,
    },
  });
  if (!user) {
    throw new NotFoundError(`No users with id ${userId} found`);
  }
  res.status(StatusCodes.OK).json({ user });
};

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export const updateUserData = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.params;
  const { name, email, bio } = req.body;

  // Check Permission
  const requestUser = req.user;
  if (!requestUser) {
    throw new UnauthorizedError('User not authorized error');
  }
  checkPermission(requestUser, userId);

  // Check if the user exist
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new NotFoundError(`User with ${userId} doesn't exist `);
  }

  // update image and upload to cloudinary
  let profile_picture: string | undefined;
  if (req.files && req.files.profile_picture) {
    const profilePicture = req.files.profile_picture as UploadedFile & {
      tempFilePath: string;
    };
    const result = await cloudinary.uploader.upload(
      profilePicture.tempFilePath,
      {
        use_filename: true,
        folder: 'lms_image',
      },
    );
    fs.unlinkSync(profilePicture.tempFilePath);
    profile_picture = result.secure_url;
  }

  const updateData: UpdateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (bio) updateData.bio = bio;
  if (profile_picture) updateData.profile_picture = profile_picture;

  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      profile_picture: true,
      created_at: true,
      updated_at: true,
    },
  });

  const tokenUser = createToken(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ updateUser });
};

export const updateUserPassword = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  // Check Permission
  const requestUser = req.user;
  if (!requestUser) {
    throw new UnauthorizedError('user not authenticated');
  }
  checkPermission(requestUser, userId);

  // Check if the user exist
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw new NotFoundError(`No users found with this id ${userId}`);
  }

  // Comparing Password
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new BadRequestError('the password is not correct');
  }

  // Hash the new Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  const updateUserPassword = await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });

  res.status(StatusCodes.OK).json({ msg: 'Password has changed successfully' });
};

const VALID_ROLES = ['ADMIN', 'USER'];

export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const { id: userId } = req.params;
  const { role } = req.body;
  if (!role || !VALID_ROLES.includes(role)) {
    const VALID_ROLES = ['ADMIN', 'USER'];
  }
  const requestUser = req.user;
  if (!requestUser || requestUser.role !== 'ADMIN') {
    throw new UnauthorizedError('Not authorized to update roles');
  }

  // update role
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  res.status(StatusCodes.OK).json({
    msg: `Role for user ${user.email} has been changed to ${user.role}`,
    user,
  });
};
