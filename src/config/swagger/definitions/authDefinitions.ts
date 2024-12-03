const authDefinitions = {
    LoginRequest: {
        type: 'object',
        required: ['username', 'password', 'device'],
        properties: {
            username: {
                type: 'string',
                example: 'admin@test.com',
            },
            password: {
                type: 'string',
                example: '123456',
            },
        },
    },
};

export default authDefinitions;
