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

// RESTful Routes
// POST /api/v1/user - Create a new user
router.post(
    '/',
    userValidationRules(),
    validate,
    checkPermissions([{ permission: 'Users', action: 'add' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.createUser(req, res, next);
    },
);

// GET /api/v1/user - Get all users
router.get(
    '/',
    checkPermissions([{ permission: 'Users', action: 'view' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.getUsers(req, res, next);
    },
);

// GET /api/v1/user/:id - Get a specific user by ID
router.get(
    '/:id',
    checkPermissions([{ permission: 'Users', action: 'view' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.getUserById(req, res, next);
    },
);

// PUT /api/v1/user/:id - Update a user
router.put(
    '/:id',
    userUpdateValidationRules(),
    validate,
    checkPermissions([{ permission: 'Users', action: 'edit' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.updateUser(req, res, next);
    },
);

// DELETE /api/v1/user/:id - Delete a user
router.delete(
    '/:id',
    checkPermissions([{ permission: 'Users', action: 'remove' }]),
    async (req: Request, res: Response, next: NextFunction) => {
        await userController.deleteUser(req, res, next);
    },
);

export default router;
