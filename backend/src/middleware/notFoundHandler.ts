import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const message = `The route ${req.method} ${req.originalUrl} was not found on this server.`;
  const error = new AppError(message, 404, 'ROUTE_NOT_FOUND');
  next(error);
};