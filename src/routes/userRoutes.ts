import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/userController';
import {
    userUpdateValidationRules,
    userValidationRules,
} from '../validators/userValidator';
import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import checkPermissions from '../middlewares/checkPermissions';

const router = Router();
const userController = container.get<UserController>(UserController);

router.post(
    '/register',
    userValidationRules(),
    validate,
    checkPermissions([{ permission: 'Users', action: 'add' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.createUser(req, res, next);
    },
);

router.get(
    '/all',
    checkPermissions([{ permission: 'Users', action: 'view' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.getUsers(req, res, next);
    },
);

router.put(
    '/:id',
    userUpdateValidationRules(),
    validate,
    checkPermissions([{ permission: 'Users', action: 'edit' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.updateUser(req, res, next);
    },
);

router.delete(
    '/:id',
    checkPermissions([{ permission: 'Users', action: 'remove' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.deleteUser(req, res, next);
    },
);

router.get(
    '/:id',
    checkPermissions([{ permission: 'Users', action: 'view' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.getUserById(req, res, next);
    },
);

export default router;
