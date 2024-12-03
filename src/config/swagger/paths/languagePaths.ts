const languagePaths = {
    '/api/v1/language/create': {
        post: {
            summary: 'Create a new language',
            security: [{ bearerAuth: [] }],
            tags: ['Language'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/Language',
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Language created successfully',
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
                                                    'Language name must be unique',
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
    '/api/v1/language/{id}': {
        get: {
            summary: 'Get role by ID',
            description: 'Endpoint to retrieve a language by ID',
            security: [{ bearerAuth: [] }],
            tags: ['Language'],
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
                    description: 'Language found',
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
            tags: ['Language'],
            summary: 'Update an existing role',
            description: 'Updates a language with the given ID.',
            security: [{ bearerAuth: [] }],
            operationId: 'updateLanguage',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the language to update',
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
                            $ref: '#/definitions/Language',
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Language updated successfully',
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
            tags: ['Language'],
            summary: 'Delete a language by ID',
            description: 'Deletes a language with the given ID.',
            security: [{ bearerAuth: [] }],
            operationId: 'deleteLanguage',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    description: 'ID of the language to delete',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
            ],
            responses: {
                '204': {
                    description: 'language deleted successfully',
                },
                '500': {
                    description: 'Internal server error',
                },
            },
        },
    },
    '/api/v1/language/all': {
        get: {
            tags: ['Language'],
            summary: 'Get all language',
            description: 'Returns a list of all languages.',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    description: 'Filter by language Id ',
                    schema: {
                        type: 'integer',
                        format: 'int64',
                    },
                },
                {
                    name: 'name',
                    in: 'query',
                    description: 'Filter by language Name ',
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
export default languagePaths;
