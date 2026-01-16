const ${modelName}Paths = {
    '/api/v1/${modelName}': {
        post: {
            summary: 'Create a new ${modelName}',
            description: 'Create a new ${modelName} in the system',
            security: [{ bearerAuth: [] }],
            tags: ['${ModelName}'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/${ModelName}',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: '${ModelName} created successfully',
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
                                                message: '${ModelName} name must be unique',
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
        get: {
            tags: ['${ModelName}'],
            summary: 'Get all ${modelName}s',
            description: 'Retrieve a list of all ${modelName}s with optional filters',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                    },
                    description: 'Filter by ${modelName} ID',
                },
                {
                    name: 'name',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'string',
                    },
                    description: 'Filter by ${modelName} Name',
                },
                {
                    name: 'status',
                    in: 'query',
                    required: false,
                    schema: {
                        type: 'integer',
                        enum: [0, 1],
                    },
                    description: 'Filter by status (Active = 1, Inactive = 0)',
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
                    description: '${ModelName}s retrieved successfully',
                    content: {
                        'application/json': {
                            examples: {
                                success: {
                                    summary: 'Example of a successful response',
                                    value: {
                                        message: '${ModelName}s data fetched successfully',
                                        result: {
                                            data: [],
                                            pagination: {
                                                currentPage: 1,
                                                pageSize: 20,
                                                totalPages: 1,
                                                totalCount: 0,
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
    '/api/v1/${modelName}/{id}': {
        get: {
            summary: 'Get ${ModelName} by ID',
            description: 'Retrieve a specific ${modelName} by its ID',
            security: [{ bearerAuth: [] }],
            tags: ['${ModelName}'],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                    description: '${ModelName} ID',
                },
            ],
            responses: {
                '200': {
                    description: '${ModelName} found',
                },
                '404': {
                    description: '${ModelName} not found',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
        put: {
            tags: ['${ModelName}'],
            summary: 'Update an existing ${ModelName}',
            description: 'Updates a ${modelName} with the given ID',
            security: [{ bearerAuth: [] }],
            operationId: 'update${ModelName}',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the ${modelName} to update',
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
                            $ref: '#/definitions/${ModelName}',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: '${ModelName} updated successfully',
                },
                '400': {
                    description: 'Invalid input',
                },
                '404': {
                    description: '${ModelName} not found',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
        delete: {
            tags: ['${ModelName}'],
            summary: 'Delete a ${modelName} by ID',
            description: 'Deletes a ${modelName} with the given ID',
            security: [{ bearerAuth: [] }],
            operationId: 'delete${ModelName}',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the ${modelName} to delete',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
            ],
            responses: {
                '200': {
                    description: '${ModelName} deleted successfully',
                },
                '404': {
                    description: '${ModelName} not found',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
    },
};

export default ${modelName}Paths;
