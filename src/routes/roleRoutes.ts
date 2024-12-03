import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import checkPermissions from '../middlewares/checkPermissions';
import { RoleController } from '../controllers/roleController';
import {
    roleValidationRules,
    roleUpdateValidationRules,
} from '../validators/roleValidator';
import { createRouter, RouteConfig } from './BaseRouter';

const roleController = container.get<RoleController>(RoleController);

const roleRoutes: RouteConfig<RoleController>[] = [
    {
        method: 'post',
        path: '/create',
        action: 'create',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'add' }]),
            roleValidationRules(),
            validate,
        ],
    },
    {
        method: 'get',
        path: '/all',
        action: 'getAll',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'view' }]),
        ],
    },
    {
        method: 'put',
        path: '/:id',
        action: 'update',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'edit' }]),
            roleUpdateValidationRules(),
            validate,
        ],
    },
    {
        method: 'delete',
        path: '/:id',
        action: 'delete',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'remove' }]),
        ],
    },
    {
        method: 'get',
        path: '/:id',
        action: 'getById',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'view' }]),
        ],
    },
];

const roleRouter = createRouter(roleController, roleRoutes);
export default roleRouter;
