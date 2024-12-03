import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import checkPermissions from '../middlewares/checkPermissions';
import { LanguageController } from '../controllers/languageController';
import { createRouter, RouteConfig } from './BaseRouter';

const languageController =
    container.get<LanguageController>(LanguageController);

const languageRoutes: RouteConfig<LanguageController>[] = [
    {
        method: 'post',
        path: '/create',
        action: 'create',
        middlewares: [
            checkPermissions([{ permission: 'Language', action: 'add' }]),
            validate,
        ],
    },
    {
        method: 'get',
        path: '/all',
        action: 'getAll',
        middlewares: [
            checkPermissions([{ permission: 'Language', action: 'view' }]),
        ],
    },
    {
        method: 'put',
        path: '/:id',
        action: 'update',
        middlewares: [
            checkPermissions([{ permission: 'Language', action: 'edit' }]),
            validate,
        ],
    },
    {
        method: 'delete',
        path: '/:id',
        action: 'delete',
        middlewares: [
            checkPermissions([{ permission: 'Language', action: 'remove' }]),
        ],
    },
    {
        method: 'get',
        path: '/:id',
        action: 'getById',
        middlewares: [
            checkPermissions([{ permission: 'Language', action: 'view' }]),
        ],
    },
];

const languageRouter = createRouter(languageController, languageRoutes);
export default languageRouter;
