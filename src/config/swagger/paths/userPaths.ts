const userPaths = {
    '/api/v1/user/register': {
        post: {
            summary: 'Register a new user',
            security: [{ bearerAuth: [] }],
            tags: ['User'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'User created successfully',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message: 'User created successfully',
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
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            examples: {
                                error: {
                                    summary: 'Example of an error response',
                                    value: {
                                        status: 'fail',
                                        errors: [
                                            {
                                                field: 'username',
                                                message:
                                                    'Username is already in use',
                                                location: 'body',
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    '/api/v1/user/{id}': {
        get: {
            summary: 'Get user by ID',
            description: 'Endpoint to retrieve a user by ID',
            security: [{ bearerAuth: [] }],
            tags: ['User'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    type: 'integer',
                },
            ],
            responses: {
                '200': {
                    description: 'User found',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message:
                                            'User data fetched successfully',
                                        result: {
                                            id: 5,
                                            firstName: 'John',
                                            lastName: 'Doe',
                                            username: 'john.doe3@example.com',
                                            phone: '1234567890',
                                            createdAt:
                                                '2024-07-10T13:45:27.487Z',
                                            updatedAt:
                                                '2024-07-10T13:45:27.487Z',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'User not found',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
        put: {
            tags: ['User'],
            summary: 'Update an existing user',
            description: 'Updates a user with the given ID.',
            security: [{ bearerAuth: [] }],
            operationId: 'updateUser',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to update',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/User',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'User updated successfully',
                    schema: {
                        $ref: '#/definitions/UserResponse',
                    },
                    examples: {
                        'application/json': {
                            message: 'User updated successfully',
                            result: {
                                id: 1,
                                firstName: 'John',
                                lastName: 'Doe',
                                username: 'john.doe@example.com',
                                phone: '1234567890',
                                createdAt: '2024-07-10T11:59:56.412Z',
                                updatedAt: '2024-07-10T11:59:56.412Z',
                            },
                        },
                    },
                },
                '400': {
                    description: 'Invalid input',
                    schema: {
                        $ref: '#/definitions/Error',
                    },
                },
                '404': {
                    description: 'User not found',
                    schema: {
                        $ref: '#/definitions/Error',
                    },
                },
                '500': {
                    description: 'Internal server error',
                    schema: {
                        $ref: '#/definitions/Error',
                    },
                },
            },
        },
        delete: {
            tags: ['User'],
            summary: 'Delete a user by ID',
            description: 'Deletes a user with the given ID.',
            security: [{ bearerAuth: [] }],
            operationId: 'deleteUser',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the user to delete',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
            ],
            responses: {
                '204': {
                    description: 'User deleted successfully',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
    },
    '/api/v1/user/all': {
        get: {
            tags: ['User'],
            summary: 'Get all users',
            description: 'Retrieve all users',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    description: 'Filter by User Id ',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
                {
                    name: 'firstName',
                    in: 'query',
                    description: 'Filter by First Name ',
                    schema: {
                        type: 'string',
                    },
                },
                {
                    name: 'lastName',
                    in: 'query',
                    description: 'Filter by Last Name ',
                    schema: {
                        type: 'string',
                    },
                },
                {
                    name: 'phone',
                    in: 'query',
                    description: 'Filter by Phone number ',
                    schema: {
                        type: 'string',
                    },
                },
                {
                    name: 'orderBy',
                    in: 'query',
                    description: 'OrderBy field  ',
                    schema: {
                        type: 'string',
                        default: 'id:desc',
                    },
                },
                {
                    name: 'page',
                    in: 'query',
                    description: 'Page Number',
                    schema: {
                        type: 'int',
                        default: '1',
                    },
                },
                {
                    name: 'limit',
                    in: 'query',
                    description: 'Number of records to fetch',
                    schema: {
                        type: 'int',
                        default: '20',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Successful response',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message:
                                            'User data fetched successfully',
                                        result: [
                                            {
                                                id: 5,
                                                firstName: 'John',
                                                lastName: 'Doe',
                                                username:
                                                    'john.doe3@example.com',
                                                phone: '1234567890',
                                                createdAt:
                                                    '2024-07-10T13:45:27.487Z',
                                                updatedAt:
                                                    '2024-07-10T13:45:27.487Z',
                                            },
                                            {
                                                id: 6,
                                                firstName: 'John',
                                                lastName: 'Doe',
                                                username:
                                                    'john.doe6@example.com',
                                                phone: '1234567890',
                                                createdAt:
                                                    '2024-07-10T13:45:27.487Z',
                                                updatedAt:
                                                    '2024-07-10T13:45:27.487Z',
                                            },
                                        ],
                                        pagination: {
                                            totalRecords: 2,
                                            totalPages: 1,
                                            currentPage: 1,
                                            recordsPerPage: 20,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
    },
};
export default userPaths;
