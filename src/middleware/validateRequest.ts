import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      errors: errors.array().map((err) => ({
        message: err.msg,
      })),
    });
    return;
  }
  next(); // Continue to the next middleware or route handler
};
