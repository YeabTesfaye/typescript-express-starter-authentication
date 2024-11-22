import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route Not Found' });
};
export default notFoundMiddleware;
