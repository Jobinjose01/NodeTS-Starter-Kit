export enum ErrorType {
    BadRequest = 'BadRequest',
    NotFound = 'NotFound',
    Forbidden = 'Forbidden',
    Unauthorized = 'Unauthorized',
    Conflict = 'Conflict',
    Internal = 'Internal',
}

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly type: ErrorType;

    constructor(type: ErrorType, message: string, statusCode: number) {
        super(message);
        this.name = 'AppError';
        this.type = type;
        this.statusCode = statusCode;

        // Maintain proper stack trace (only available on V8 environments)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
