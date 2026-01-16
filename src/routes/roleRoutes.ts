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

// RESTful Routes
const roleRoutes: RouteConfig<RoleController>[] = [
    {
        method: 'post',
        path: '/', // POST /api/v1/role - Create a new role
        action: 'create',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'add' }]),
            roleValidationRules(),
            validate,
        ],
    },
    {
        method: 'get',
        path: '/', // GET /api/v1/role - Get all roles
        action: 'getAll',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'view' }]),
        ],
    },
    {
        method: 'get',
        path: '/:id', // GET /api/v1/role/:id - Get a specific role
        action: 'getById',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'view' }]),
        ],
    },
    {
        method: 'put',
        path: '/:id', // PUT /api/v1/role/:id - Update a role
        action: 'update',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'edit' }]),
            roleUpdateValidationRules(),
            validate,
        ],
    },
    {
        method: 'delete',
        path: '/:id', // DELETE /api/v1/role/:id - Delete a role
        action: 'delete',
        middlewares: [
            checkPermissions([{ permission: 'Roles', action: 'remove' }]),
        ],
    },
];

const roleRouter = createRouter(roleController, roleRoutes);
export default roleRouter;
