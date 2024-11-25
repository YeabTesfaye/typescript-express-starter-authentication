import UnauthorizedError from './anauthorized';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

interface User {
  role: UserRole;
  userId: string;
}

export const checkPermission = (
  requestUser: User,
  _resourceUserId: string,
): void => {
  // Allow access if the user is an admin
  if (requestUser.role === UserRole.ADMIN) return;

  // Otherwise, throw an UnauthorizedError
  throw new UnauthorizedError(
    `User ${requestUser.userId} is not authorized to access this route`,
  );
};
