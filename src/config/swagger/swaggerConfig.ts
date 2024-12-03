import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

// Path Imports
import authPaths from './paths/authPaths';
import rolePaths from './paths/rolePaths';
import userPaths from './paths/userPaths';
import permissionPaths from './paths/permissionPaths';

// Definition Imports
import authDefinitions from './definitions/authDefinitions';
import roleDefinitions from './definitions/roleDefinitions';
import commonDefinitions from './definitions/commonDefinitions';
import userDefinition from './definitions/userDefinitions';
import permissionDefinitions from './definitions/permissionDefinitions';

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
        // register new paths here
        ...authPaths,
        ...rolePaths,
        ...userPaths,
        ...permissionPaths,
    },
    definitions: {
        // register new defintions here
        ...authDefinitions,
        ...roleDefinitions,
        ...commonDefinitions,
        ...userDefinition,
        ...permissionDefinitions,
    },
};

const setupSwagger = (app: Application) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
