const ${modelName}Paths = {
    '/api/v1/${modelName}/create': {
        post: {
            summary: 'Create a new ${modelName}',
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
                                                message:
                                                    '${ModelName} name must be unique',
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
    '/api/v1/${modelName}/{id}': {
        get: {
            summary: 'Get role by ID',
            description: 'Endpoint to retrieve a ${modelName} by ID',
            security: [{ bearerAuth: [] }],
            tags: ['${ModelName}'],
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
                    description: '${ModelName} found',
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
            tags: ['${ModelName}'],
            summary: 'Update an existing role',
            description: 'Updates a ${modelName} with the given ID.',
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
            tags: ['${ModelName}'],
            summary: 'Delete a ${modelName} by ID',
            description: 'Deletes a ${modelName} with the given ID.',
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
                '204': {
                    description: '${modelName} deleted successfully',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
    },
    '/api/v1/${modelName}/all': {
        get: {
            tags: ['${ModelName}'],
            summary: 'Get all ${modelName}',
            description: 'Returns a list of all ${modelName}s.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    description: 'Filter by ${modelName} Id ',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
                {
                    name: 'name',
                    in: 'query',
                    description: 'Filter by ${modelName} Name ',
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
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
    },
};
export default ${modelName}Paths;
