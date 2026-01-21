const passwordDefinitions = {
    ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                example: 'user@example.com',
                description:
                    'Email address of the user requesting password reset',
            },
        },
    },
    ResetPasswordRequest: {
        type: 'object',
        required: ['token', 'newPassword', 'confirmPassword'],
        properties: {
            token: {
                type: 'string',
                example: 'abc123def456ghi789jkl012mno345pq',
                description: 'Password reset token received via email',
            },
            newPassword: {
                type: 'string',
                format: 'password',
                minLength: 6,
                example: 'NewPass123',
                description:
                    'New password (min 6 chars, must contain uppercase, lowercase, and number)',
            },
            confirmPassword: {
                type: 'string',
                format: 'password',
                example: 'NewPass123',
                description:
                    'Confirmation of new password (must match newPassword)',
            },
        },
    },
    ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword', 'confirmPassword'],
        properties: {
            currentPassword: {
                type: 'string',
                format: 'password',
                example: 'OldPass123',
                description: 'Current password for verification',
            },
            newPassword: {
                type: 'string',
                format: 'password',
                minLength: 6,
                example: 'NewPass123',
                description:
                    'New password (min 6 chars, must contain uppercase, lowercase, and number)',
            },
            confirmPassword: {
                type: 'string',
                format: 'password',
                example: 'NewPass123',
                description:
                    'Confirmation of new password (must match newPassword)',
            },
        },
    },
    PasswordSuccessResponse: {
        type: 'object',
        properties: {
            status: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Password reset email sent successfully',
            },
        },
    },
    TokenValidationResponse: {
        type: 'object',
        properties: {
            status: {
                type: 'boolean',
                example: true,
            },
            message: {
                type: 'string',
                example: 'Reset token is valid',
            },
        },
    },
    PasswordErrorResponse: {
        type: 'object',
        properties: {
            status: {
                type: 'boolean',
                example: false,
            },
            message: {
                type: 'string',
                example: 'Invalid or expired reset token',
            },
        },
    },
};

export default passwordDefinitions;
