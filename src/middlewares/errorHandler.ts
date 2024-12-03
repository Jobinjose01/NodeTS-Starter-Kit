import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { formatErrors } from '../utils/errorFormatter';
import logger from '../utils/logger';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (process.env.APP_DEBUG) {
        console.error(err); // Log the error for debugging
    }

    // Handle Passport authentication errors
    if (err.name === 'UnauthorizedError' || err.message === 'Unauthorized') {
        return res.status(401).json({
            status: 'fail',
            error: err.message,
            message: 'Unauthorized access',
        });
    }

    if (err.name === 'FileFormatError') {
        return res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }

    if (err instanceof Error) {
        if (process.env.ERROR_LOG) {
            logger.error(err);
        }

        return res.status(500).json({
            status: 'error',
            error: err.message,
            message: res.__('common.SOMETHING_WENT_WRONG'),
        });
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'fail',
            errors: formatErrors(errors.array()),
        });
    }

    next();
};
