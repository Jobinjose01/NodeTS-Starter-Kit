const permissionDefinitions = {
    RolePermissionDTO: {
        type: 'object',
        properties: {
            roleId: {
                type: 'integer',
            },
            permissions: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        permissionId: {
                            type: 'integer',
                        },
                        add: {
                            type: 'integer',
                            default: 0,
                        },
                        edit: {
                            type: 'integer',
                            default: 0,
                        },
                        remove: {
                            type: 'integer',
                            default: 0,
                        },
                        view: {
                            type: 'integer',
                            default: 0,
                        },
                        reordering: {
                            type: 'integer',
                            default: 0,
                        },
                    },
                },
            },
        },
        required: ['roleId', 'permissions'],
    },
    RolePermission: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
            },
            roleId: {
                type: 'integer',
            },
            permissionId: {
                type: 'integer',
            },
            add: {
                type: 'integer',
            },
            edit: {
                type: 'integer',
            },
            remove: {
                type: 'integer',
            },
            view: {
                type: 'integer',
            },
            reordering: {
                type: 'integer',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
            },
        },
    },
    BatchPayload: {
        type: 'object',
        properties: {
            result: {
                count: 5,
            },
        },
    },
};
export default permissionDefinitions;
