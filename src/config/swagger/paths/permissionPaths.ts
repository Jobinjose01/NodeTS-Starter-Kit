const permissionPaths = {
    '/api/v1/permission': {
        post: {
            tags: ['Permissions'],
            summary: 'Create Role Permissions',
            description: 'Create multiple role permissions for a specific role',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/definitions/RolePermissionDTO',
                        },
                        example: {
                            roleId: 1,
                            permissions: [
                                {
                                    permissionId: 1,
                                    add: 1,
                                    edit: 1,
                                    remove: 1,
                                    view: 1,
                                },
                                {
                                    permissionId: 2,
                                    add: 1,
                                    edit: 1,
                                    remove: 1,
                                    view: 1,
                                },
                                {
                                    permissionId: 3,
                                    add: 1,
                                    edit: 1,
                                    remove: 1,
                                    view: 1,
                                },
                            ],
                        },
                    },
                },
            },
            responses: {
                '201': {
                    description: 'Role permissions created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/BatchPayload',
                            },
                        },
                    },
                },
                '400': {
                    description: 'Invalid request payload',
                },
                '500': {
                    description: 'Internal Server Error',
                },
            },
        },
    },
    '/api/v1/permission/{roleId}': {
        get: {
            tags: ['Permissions'],
            summary: 'Get Permissions by Role ID',
            description: 'Get all permissions associated with a specific role',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'roleId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                    example: 1,
                },
            ],
            responses: {
                '200': {
                    description: 'Permissions fetched successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    result: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                roleId: {
                                                    type: 'integer',
                                                },
                                                permissionId: {
                                                    type: 'integer',
                                                },
                                                add: {
                                                    type: 'integer',
                                                    enum: [0, 1],
                                                },
                                                edit: {
                                                    type: 'integer',
                                                    enum: [0, 1],
                                                },
                                                remove: {
                                                    type: 'integer',
                                                    enum: [0, 1],
                                                },
                                                view: {
                                                    type: 'integer',
                                                    enum: [0, 1],
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                '400': {
                    description: 'Role ID is required',
                },
                '500': {
                    description: 'Internal Server Error',
                },
            },
        },
        delete: {
            tags: ['Permissions'],
            summary: 'Delete Role Permissions by Role ID',
            description:
                'Delete all permissions associated with a specific role',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'roleId',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                    example: 1,
                },
            ],
            responses: {
                '200': {
                    description: 'Role permissions deleted successfully',
                },
                '400': {
                    description: 'Role ID is required',
                },
                '500': {
                    description: 'Internal Server Error',
                },
            },
        },
    },
};

export default permissionPaths;
