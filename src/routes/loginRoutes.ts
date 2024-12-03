import { Router, Request, Response, NextFunction } from 'express';
import { LoginController } from '../controllers/loginController';
import { loginValidationRules } from '../validators/loginValidator';
import { validate } from '../middlewares/validate';
import container from '../config/inversifyConfig';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();
const loginController = container.get<LoginController>(LoginController);

router.post(
    '/login',
    loginValidationRules(),
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
        await loginController.login(req, res, next);
    },
);

router.post(
    '/logout',
    authMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        await loginController.logout(req, res, next);
    },
);

export default router;
