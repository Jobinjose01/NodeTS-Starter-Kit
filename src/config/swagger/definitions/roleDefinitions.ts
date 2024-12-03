const roleDefinitions = {
    Role: {
        type: 'object',
        required: ['name'],
        properties: {
            name: {
                type: 'string',
            },
            status: {
                type: 'integer',
                example: 1,
            },
        },
    },
    RoleResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                format: 'int64',
            },
            name: {
                type: 'string',
                default: 'Role number 5',
            },
            status: {
                type: 'integer',
                default: 1,
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
};
export default roleDefinitions;
