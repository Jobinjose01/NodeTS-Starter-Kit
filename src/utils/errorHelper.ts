import { AppError, ErrorType } from '../middlewares/appError';

export const createBadRequestError = (message: string) =>
    new AppError(ErrorType.BadRequest, message, 400);

export const createNotFoundError = (message: string) =>
    new AppError(ErrorType.NotFound, message, 404);

export const createConflictError = (message: string) =>
    new AppError(ErrorType.Conflict, message, 409);

export const createInternalError = (message: string) =>
    new AppError(ErrorType.Internal, message, 500);
