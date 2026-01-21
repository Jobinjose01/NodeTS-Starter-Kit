import { body, ValidationChain } from 'express-validator';

/**
 * Validation rules for password reset request
 */
export const requestPasswordResetRules = (): ValidationChain[] => {
    return [
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
    ];
};

/**
 * Validation rules for reset password
 */
export const resetPasswordRules = (): ValidationChain[] => {
    return [
        body('token')
            .notEmpty()
            .withMessage('Reset token is required')
            .isString()
            .withMessage('Invalid token format'),
        body('newPassword')
            .notEmpty()
            .withMessage('New password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage(
                'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            ),
        body('confirmPassword')
            .notEmpty()
            .withMessage('Password confirmation is required')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),
    ];
};

/**
 * Validation rules for change password (authenticated)
 */
export const changePasswordRules = (): ValidationChain[] => {
    return [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        body('newPassword')
            .notEmpty()
            .withMessage('New password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage(
                'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            )
            .custom((value, { req }) => {
                if (value === req.body.currentPassword) {
                    throw new Error(
                        'New password must be different from current password',
                    );
                }
                return true;
            }),
        body('confirmPassword')
            .notEmpty()
            .withMessage('Password confirmation is required')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Passwords do not match');
                }
                return true;
            }),
    ];
};
