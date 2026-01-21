import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

// Path & definition Imports
import authPaths from './paths/authPaths';
import rolePaths from './paths/rolePaths';
import userPaths from './paths/userPaths';
import permissionPaths from './paths/permissionPaths';
import passwordPaths from './paths/passwordPaths';
// Path Imports ends

// Definition Imports
import authDefinitions from './definitions/authDefinitions';
import roleDefinitions from './definitions/roleDefinitions';
import commonDefinitions from './definitions/commonDefinitions';
import userDefinition from './definitions/userDefinitions';
import permissionDefinitions from './definitions/permissionDefinitions';
import passwordDefinitions from './definitions/passwordDefinitions';
// Definition Imports ends

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API documentation',
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT}`,
            description: `${process.env.NODE_ENV} server`,
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        ...authPaths,
        ...passwordPaths,
        ...rolePaths,
        ...userPaths,
        ...permissionPaths,
        // register new paths here
    },
    definitions: {
        ...authDefinitions,
        ...passwordDefinitions,
        ...roleDefinitions,
        ...commonDefinitions,
        ...userDefinition,
        ...permissionDefinitions,
        // register new defintions here
    },
};

const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
