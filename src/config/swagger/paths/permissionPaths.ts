const permissionPaths = {
    '/api/v1/permission/create': {
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
                                    reordering: 1,
                                },
                                {
                                    permissionId: 2,
                                    add: 1,
                                    edit: 1,
                                    remove: 1,
                                    view: 1,
                                    reordering: 1,
                                },
                                {
                                    permissionId: 3,
                                    add: 1,
                                    edit: 1,
                                    remove: 1,
                                    view: 1,
                                    reordering: 1,
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
                    description: 'Permissions retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/RolePermission',
                                },
                            },
                            example: {
                                message: 'Permissions retrieved successfully',
                                result: [
                                    {
                                        id: 2,
                                        roleId: 1,
                                        permissionId: 1,
                                        add: 1,
                                        edit: 1,
                                        remove: 1,
                                        view: 1,
                                        reordering: 1,
                                        createdAt: '2024-08-07T07:16:49.518Z',
                                        updatedAt: '2024-08-07T07:16:49.518Z',
                                        deletedAt: null,
                                        permission: {
                                            id: 1,
                                            name: 'Users',
                                            createdAt:
                                                '2024-08-05T05:23:35.665Z',
                                            updatedAt:
                                                '2024-08-05T05:23:35.665Z',
                                            deletedAt: null,
                                        },
                                    },
                                    {
                                        id: 3,
                                        roleId: 1,
                                        permissionId: 2,
                                        add: 1,
                                        edit: 1,
                                        remove: 1,
                                        view: 1,
                                        reordering: 1,
                                        createdAt: '2024-08-07T07:16:49.518Z',
                                        updatedAt: '2024-08-07T07:16:49.518Z',
                                        deletedAt: null,
                                        permission: {
                                            id: 2,
                                            name: 'Roles',
                                            createdAt:
                                                '2024-08-05T05:23:35.671Z',
                                            updatedAt:
                                                '2024-08-05T05:23:35.671Z',
                                            deletedAt: null,
                                        },
                                    },
                                ],
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
    },
};
export default permissionPaths;
