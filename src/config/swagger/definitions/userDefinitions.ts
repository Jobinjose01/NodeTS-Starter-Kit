const userDefinitions = {
    User: {
        type: 'object',
        required: [
            'firstName',
            'lastName',
            'username',
            'phone',
            'roleId',
            'status',
        ],
        properties: {
            firstName: {
                type: 'string',
                default: 'John',
            },
            lastName: {
                type: 'string',
                default: 'Doe',
            },
            username: {
                type: 'string',
                default: 'JohnDoe@gmail.com',
            },
            phone: {
                type: 'string',
                default: '1234567890',
            },
            status: {
                type: 'int',
                default: '1',
            },
            roleId: {
                type: 'int',
                default: '4',
            },
            password: {
                type: 'string',
                default: '123456',
            },
        },
    },
};
export default userDefinitions;
