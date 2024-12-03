const languageDefinitions = {
    Language: {
        type: 'object',
        required: ['title', 'langCode', 'flag'],
        properties: {
            title: {
                type: 'string',
            },
            langCode: {
                type: 'string',
            },
            flag: {
                type: 'string',
            },
        },
    },
};
export default languageDefinitions;
