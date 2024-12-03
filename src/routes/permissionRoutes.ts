import { Router, Request, Response, NextFunction } from 'express';
import { PermissionController } from '../controllers/permissionController';
import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import checkPermissions from '../middlewares/checkPermissions';
import { rolePermissionValidationRules } from '../validators/rolePermissionValidator';
import { createRouter, RouteConfig } from './BaseRouter';

const router = Router();
const permissionController =
    container.get<PermissionController>(PermissionController);

const roleRoutes: RouteConfig<PermissionController>[] = [
    {
        method: 'post',
        path: '/create',
        action: 'create',
        middlewares: [
            checkPermissions([{ permission: 'Permissions', action: 'add' }]),
            rolePermissionValidationRules(),
            validate,
        ],
    },
    {
        method: 'delete',
        path: '/:id',
        action: 'delete',
        middlewares: [
            checkPermissions([{ permission: 'Permissions', action: 'remove' }]),
        ],
    },
    {
        method: 'get',
        path: '/:id',
        action: 'getById',
        middlewares: [
            checkPermissions([{ permission: 'Permissions', action: 'view' }]),
        ],
    },
];

const roleRouter = createRouter(permissionController, roleRoutes);
export default roleRouter;
