import { PermissionController } from '../controllers/permissionController';
import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import checkPermissions from '../middlewares/checkPermissions';
import { rolePermissionValidationRules } from '../validators/rolePermissionValidator';
import { createRouter, RouteConfig } from './BaseRouter';

const permissionController =
    container.get<PermissionController>(PermissionController);

// RESTful Routes
const roleRoutes: RouteConfig<PermissionController>[] = [
    {
        method: 'post',
        path: '/', // POST /api/v1/permission - Create a new permission
        action: 'create',
        middlewares: [
            checkPermissions([{ permission: 'Permissions', action: 'add' }]),
            rolePermissionValidationRules(),
            validate,
        ],
    },
    {
        method: 'get',
        path: '/:id', // GET /api/v1/permission/:id - Get a specific permission
        action: 'getById',
        middlewares: [
            checkPermissions([{ permission: 'Permissions', action: 'view' }]),
        ],
    },
    {
        method: 'delete',
        path: '/:id', // DELETE /api/v1/permission/:id - Delete a permission
        action: 'delete',
        middlewares: [
            checkPermissions([{ permission: 'Permissions', action: 'remove' }]),
        ],
    },
];

const roleRouter = createRouter(permissionController, roleRoutes);
export default roleRouter;
