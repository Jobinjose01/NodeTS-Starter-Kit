const authPaths = {
    '/api/v1/auth/login': {
        post: {
            tags: ['Authentication'],
            summary: 'User login',
            description: 'Login a user and return a JWT token.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/LoginRequest',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Successfully logged in',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message: 'Successfully logged in',
                                        result: {
                                            id: 5,
                                            firstName: 'John',
                                            lastName: 'Doe',
                                            username: 'john.doe3@example.com',
                                            phone: '1234567890',
                                            roleId: '4',
                                            status: '1',
                                            createdAt:
                                                '2024-07-10T13:45:27.487Z',
                                            updatedAt:
                                                '2024-07-10T13:45:27.487Z',
                                            token: 'your JWT token',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Invalid email or password',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Invalid email or password',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/v1/auth/logout': {
        post: {
            tags: ['Authentication'],
            summary: 'User logout',
            description: 'Logout a user by invalidating the JWT token.',
            security: [{ bearerAuth: [] }],
            responses: {
                '200': {
                    description: 'Successfully logged out',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Successfully logged out',
                                    },
                                },
                            },
                        },
                    },
                },
                '401': {
                    description: 'Token does not exist or is invalid',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example:
                                            'Token does not exist or is invalid',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default authPaths;
