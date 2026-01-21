import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import checkPermissions from '../middlewares/checkPermissions';
import { UserController } from '../controllers/userController';
import {
    userUpdateValidationRules,
    userValidationRules,
} from '../validators/userValidator';
import { createRouter, RouteConfig } from './BaseRouter';

const userController = container.get<UserController>(UserController);

// RESTful Routes
const userRoutes: RouteConfig<UserController>[] = [
    {
        method: 'post',
        path: '/', // POST /api/v1/user - Create a new user
        action: 'create',
        middlewares: [
            checkPermissions([{ permission: 'Users', action: 'add' }]),
            userValidationRules(),
            validate,
        ],
    },
    {
        method: 'get',
        path: '/', // GET /api/v1/user - Get all users
        action: 'getAll',
        middlewares: [
            checkPermissions([{ permission: 'Users', action: 'view' }]),
        ],
    },
    {
        method: 'get',
        path: '/:id', // GET /api/v1/user/:id - Get a specific user by ID
        action: 'getById',
        middlewares: [
            checkPermissions([{ permission: 'Users', action: 'view' }]),
        ],
    },
    {
        method: 'put',
        path: '/:id', // PUT /api/v1/user/:id - Update a user
        action: 'update',
        middlewares: [
            checkPermissions([{ permission: 'Users', action: 'edit' }]),
            userUpdateValidationRules(),
            validate,
        ],
    },
    {
        method: 'delete',
        path: '/:id', // DELETE /api/v1/user/:id - Delete a user
        action: 'delete',
        middlewares: [
            checkPermissions([{ permission: 'Users', action: 'remove' }]),
        ],
    },
];

const userRouter = createRouter(userController, userRoutes);
export default userRouter;
