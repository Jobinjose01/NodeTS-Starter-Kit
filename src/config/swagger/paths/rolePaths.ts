const rolePaths = {
    '/api/v1/role/create': {
        post: {
            summary: 'Create a new role',
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
                                                    'Role name must be unique',
                                                location: 'body',
                                            },
                                        ],
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
            description: 'Endpoint to retrieve a role by ID',
            security: [{ bearerAuth: [] }],
            tags: ['Role'],
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
                                            id: 5,
                                            content: 'Role number 5',
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
            description: 'Updates a role with the given ID.',
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
                    schema: {
                        $ref: '#/definitions/RoleResponse',
                    },
                    examples: {
                        'application/json': {
                            message: 'Role updated successfully',
                            result: {
                                id: 5,
                                name: 'Role number 5',
                                status: 1,
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
                    description: 'Role not found',
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
            tags: ['Role'],
            summary: 'Delete a role by ID',
            description: 'Deletes a role with the given ID.',
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
                '204': {
                    description: 'Role deleted successfully',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
    },
    '/api/v1/role/all': {
        get: {
            tags: ['Role'],
            summary: 'Get all roles',
            description: 'Returns a list of all roles.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    description: 'Filter by Role Id ',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
                {
                    name: 'name',
                    in: 'query',
                    description: 'Filter by Role Name ',
                    schema: {
                        type: 'string',
                    },
                },
                {
                    name: 'status',
                    in: 'query',
                    description: 'Active = 1 , inactive = 0',
                    schema: {
                        type: 'number',
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
                                            'Roles data fetched successfully',
                                        result: [
                                            {
                                                id: 5,
                                                name: 'Role number 5',
                                                status: 1,
                                                createdAt:
                                                    '2024-07-10T13:45:27.487Z',
                                                updatedAt:
                                                    '2024-07-10T13:45:27.487Z',
                                            },
                                            {
                                                id: 6,
                                                name: 'Role number 6',
                                                status: 1,
                                                createdAt:
                                                    '2024-07-10T13:45:27.487Z',
                                                updatedAt:
                                                    '2024-07-10T13:45:27.487Z',
                                            },
                                        ],
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
export default rolePaths;
