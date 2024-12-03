import { Router, Request, Response, NextFunction } from 'express';
import { PermissionController } from '../controllers/permissionController';
import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import checkPermissions from '../middlewares/checkPermissions';
import { rolePermissionValidationRules } from '../validators/rolePermissionValidator';

const router = Router();
const permissionController =
    container.get<PermissionController>(PermissionController);

router.post(
    '/create',
    rolePermissionValidationRules(),
    validate,
    checkPermissions([{ permission: 'Permissions', action: 'add' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await permissionController.createPermission(req, res, next);
    },
);

router.delete(
    '/:id',
    checkPermissions([{ permission: 'Permissions', action: 'remove' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await permissionController.deletePermission(req, res, next);
    },
);

router.get(
    '/:id',
    checkPermissions([{ permission: 'Permissions', action: 'view' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await permissionController.getPermissionByRoleId(req, res, next);
    },
);

export default router;
