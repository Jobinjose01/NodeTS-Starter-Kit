const passwordPaths = {
    '/api/v1/password/forgot': {
        post: {
            tags: ['Password Management'],
            summary: 'Request password reset',
            description:
                'Send a password reset email to the user. For security reasons, always returns success even if email does not exist.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/ForgotPasswordRequest',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description:
                        'Password reset request processed successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordSuccessResponse',
                            },
                            example: {
                                status: true,
                                message:
                                    'If an account with that email exists, a password reset link has been sent',
                            },
                        },
                    },
                },
                '400': {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordErrorResponse',
                            },
                            example: {
                                status: false,
                                message: 'Please provide a valid email address',
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordErrorResponse',
                            },
                            example: {
                                status: false,
                                message:
                                    'Failed to process password reset request',
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/v1/password/verify/{token}': {
        get: {
            tags: ['Password Management'],
            summary: 'Verify reset token',
            description:
                'Verify if a password reset token is valid and not expired.',
            parameters: [
                {
                    name: 'token',
                    in: 'path',
                    required: true,
                    description: 'Password reset token from email',
                    schema: {
                        type: 'string',
                        example: 'abc123def456ghi789jkl012mno345pq',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Token is valid',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/TokenValidationResponse',
                            },
                            example: {
                                status: true,
                                message: 'Reset token is valid',
                            },
                        },
                    },
                },
                '400': {
                    description: 'Invalid or expired token',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordErrorResponse',
                            },
                            example: {
                                status: false,
                                message: 'Invalid or expired reset token',
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/v1/password/reset': {
        post: {
            tags: ['Password Management'],
            summary: 'Reset password with token',
            description:
                'Reset user password using a valid reset token. Token will be invalidated after successful reset.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/ResetPasswordRequest',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Password reset successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordSuccessResponse',
                            },
                            example: {
                                status: true,
                                message:
                                    'Password has been reset successfully. You can now log in with your new password',
                            },
                        },
                    },
                },
                '400': {
                    description: 'Validation error or invalid token',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordErrorResponse',
                            },
                            examples: {
                                invalidToken: {
                                    summary: 'Invalid or expired token',
                                    value: {
                                        status: false,
                                        message:
                                            'Invalid or expired reset token',
                                    },
                                },
                                passwordMismatch: {
                                    summary: 'Password confirmation mismatch',
                                    value: {
                                        status: false,
                                        message: 'Passwords do not match',
                                    },
                                },
                                weakPassword: {
                                    summary:
                                        'Password does not meet requirements',
                                    value: {
                                        status: false,
                                        message:
                                            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                                    },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordErrorResponse',
                            },
                            example: {
                                status: false,
                                message: 'Failed to reset password',
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/v1/password/change': {
        put: {
            tags: ['Password Management'],
            summary: 'Change password (authenticated)',
            description:
                'Change password for the currently authenticated user. Requires valid JWT token.',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/ChangePasswordRequest',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Password changed successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordSuccessResponse',
                            },
                            example: {
                                status: true,
                                message: 'Password changed successfully',
                            },
                        },
                    },
                },
                '400': {
                    description: 'Validation error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordErrorResponse',
                            },
                            examples: {
                                incorrectCurrent: {
                                    summary: 'Current password incorrect',
                                    value: {
                                        status: false,
                                        message:
                                            'Current password is incorrect',
                                    },
                                },
                                passwordMismatch: {
                                    summary: 'New passwords do not match',
                                    value: {
                                        status: false,
                                        message: 'Passwords do not match',
                                    },
                                },
                                samePassword: {
                                    summary: 'New password same as current',
                                    value: {
                                        status: false,
                                        message:
                                            'New password must be different from current password',
                                    },
                                },
                                weakPassword: {
                                    summary:
                                        'Password does not meet requirements',
                                    value: {
                                        status: false,
                                        message:
                                            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Unauthorized - Invalid or missing token',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordErrorResponse',
                            },
                            example: {
                                status: false,
                                message: 'Unauthorized',
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/PasswordErrorResponse',
                            },
                            example: {
                                status: false,
                                message: 'Failed to change password',
                            },
                        },
                    },
                },
            },
        },
    },
};

export default passwordPaths;
