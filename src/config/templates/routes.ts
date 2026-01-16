import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import checkPermissions from '../middlewares/checkPermissions';
import { ${ModelName}Controller } from '../controllers/${modelName}Controller';
import {
    ${modelName}ValidationRules,
    ${modelName}UpdateValidationRules,
} from '../validators/${modelName}Validator';
import { createRouter, RouteConfig } from './BaseRouter';

const ${modelName}Controller = container.get<${ModelName}Controller>(${ModelName}Controller);

const ${modelName}Routes: RouteConfig<${ModelName}Controller>[] = [
    {
        method: 'post',
        path: '/',
        action: 'create',
        middlewares: [
            checkPermissions([{ permission: '${permission}', action: 'add' }]),
            ${modelName}ValidationRules(),
            validate,
        ],
    },
    {
        method: 'get',
        path: '/',
        action: 'getAll',
        middlewares: [
            checkPermissions([{ permission: '${permission}', action: 'view' }]),
        ],
    },
    {
        method: 'get',
        path: '/:id',
        action: 'getById',
        middlewares: [
            checkPermissions([{ permission: '${permission}', action: 'view' }]),
        ],
    },
    {
        method: 'put',
        path: '/:id',
        action: 'update',
        middlewares: [
            checkPermissions([{ permission: '${permission}', action: 'edit' }]),
            ${modelName}UpdateValidationRules(),
            validate,
        ],
    },
    {
        method: 'delete',
        path: '/:id',
        action: 'delete',
        middlewares: [
            checkPermissions([{ permission: '${permission}', action: 'remove' }]),
        ],
    },
];

const ${modelName}Router = createRouter(${modelName}Controller, ${modelName}Routes);
export default ${modelName}Router;
