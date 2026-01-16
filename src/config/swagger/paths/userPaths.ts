const userPaths = {
    '/api/v1/user': {
        post: {
            summary: 'Create a new user',
            description: 'Create a new user in the system',
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
        get: {
            summary: 'Get all users',
            description: 'Retrieve a list of all users with optional filters',
            security: [{ bearerAuth: [] }],
            tags: ['User'],
            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                    },
                    description: 'Filter by User ID',
                },
                {
                    name: 'firstName',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Filter by First Name',
                },
                {
                    name: 'lastName',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Filter by Last Name',
                },
                {
                    name: 'phone',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Filter by Phone number',
                },
                {
                    name: 'orderBy',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                        default: 'id:desc',
                    },
                    description: 'Order by field (e.g., id:desc)',
                },
                {
                    name: 'page',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                        default: 1,
                    },
                    description: 'Page number for pagination',
                },
                {
                    name: 'limit',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                        default: 20,
                    },
                    description: 'Number of records per page',
                },
            ],
            responses: {
                '200': {
                    description: 'Users retrieved successfully',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message:
                                            'Users data fetched successfully',
                                        result: {
                                            data: [
                                                {
                                                    id: 5,
                                                    firstName: 'John',
                                                    lastName: 'Doe',
                                                    username:
                                                        'john.doe3@example.com',
                                                    phone: '1234567890',
                                                    roleId: '4',
                                                    status: '1',
                                                    createdAt:
                                                        '2024-07-10T13:45:27.487Z',
                                                    updatedAt:
                                                        '2024-07-10T13:45:27.487Z',
                                                },
                                            ],
                                            pagination: {
                                                currentPage: 1,
                                                pageSize: 20,
                                                totalPages: 1,
                                                totalCount: 1,
                                            },
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
    '/api/v1/user/{id}': {
        get: {
            summary: 'Get user by ID',
            description: 'Retrieve a specific user by their ID',
            security: [{ bearerAuth: [] }],
            tags: ['User'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                    description: 'User ID',
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
            description: 'Updates a user with the given ID',
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
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message: 'User updated successfully',
                                        result: {
                                            id: 1,
                                            firstName: 'John',
                                            lastName: 'Doe',
                                            username: 'john.doe@example.com',
                                            phone: '1234567890',
                                            roleId: '4',
                                            status: '1',
                                            createdAt:
                                                '2024-07-10T11:59:56.412Z',
                                            updatedAt:
                                                '2024-07-10T11:59:56.412Z',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Invalid input',
                },
                '404': {
                    description: 'User not found',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
        delete: {
            tags: ['User'],
            summary: 'Delete a user by ID',
            description: 'Deletes a user with the given ID',
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
                '200': {
                    description: 'User deleted successfully',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message: 'User deleted successfully',
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
    },
};

export default userPaths;
