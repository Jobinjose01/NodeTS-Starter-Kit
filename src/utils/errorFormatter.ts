interface FormattedError {
    field: string;
    message: string;
    location: string;
}
interface ValidationError {
    path?: string;
    msg?: string;
    location?: string;
}

export const formatErrors = (errors: ValidationError[]): FormattedError[] => {
    return errors.map((error: ValidationError) => ({
        field: error.path || 'unknown',
        message: error.msg || 'Validation error',
        location: error.location || 'unknown',
    }));
};
