const rolePaths = {
    '/api/v1/role': {
        post: {
            summary: 'Create a new role',
            description: 'Create a new role in the system',
            security: [{ bearerAuth: [] }],
            tags: ['Role'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/Role',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Role created successfully',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message: 'Role created successfully',
                                        result: {
                                            id: 5,
                                            name: 'role number 5',
                                            status: 1,
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
                                                field: 'name',
                                                message:
                                                    'Role name is already in use',
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
            summary: 'Get all roles',
            description: 'Retrieve a list of all roles with optional filters',
            security: [{ bearerAuth: [] }],
            tags: ['Role'],
            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                    },
                    description: 'Filter by Role ID',
                },
                {
                    name: 'name',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Filter by Role Name',
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
                    description: 'Roles retrieved successfully',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message:
                                            'Roles data fetched successfully',
                                        result: {
                                            data: [
                                                {
                                                    id: 1,
                                                    name: 'Admin',
                                                    status: 1,
                                                    createdAt:
                                                        '2024-07-10T11:59:56.412Z',
                                                    updatedAt:
                                                        '2024-07-10T11:59:56.412Z',
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
    '/api/v1/role/{id}': {
        get: {
            summary: 'Get role by ID',
            description: 'Retrieve a specific role by its ID',
            security: [{ bearerAuth: [] }],
            tags: ['Role'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                    description: 'Role ID',
                },
            ],
            responses: {
                '200': {
                    description: 'Role found',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message:
                                            'Role data fetched successfully',
                                        result: {
                                            id: 1,
                                            name: 'Admin',
                                            status: 1,
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
                '404': {
                    description: 'Role not found',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
        put: {
            tags: ['Role'],
            summary: 'Update an existing role',
            description: 'Updates a role with the given ID',
            security: [{ bearerAuth: [] }],
            operationId: 'updateRole',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the role to update',
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
                            $ref: '#/definitions/Role',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Role updated successfully',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message: 'Role updated successfully',
                                        result: {
                                            id: 1,
                                            name: 'Admin Updated',
                                            status: 1,
                                            createdAt:
                                                '2024-07-10T11:59:56.412Z',
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
                    description: 'Invalid input',
                },
                '404': {
                    description: 'Role not found',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
        delete: {
            tags: ['Role'],
            summary: 'Delete a role by ID',
            description: 'Deletes a role with the given ID',
            security: [{ bearerAuth: [] }],
            operationId: 'deleteRole',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the role to delete',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
            ],
            responses: {
                '200': {
                    description: 'Role deleted successfully',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message: 'Role deleted successfully',
                                    },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'Role not found',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
    },
};

export default rolePaths;
