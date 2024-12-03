import { Router, Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';

export type RouteConfig<T> = {
    method: 'get' | 'post' | 'put' | 'delete';
    path: string;
    action: keyof T;
    middlewares?: Array<
        | ((req: Request, res: Response, next: NextFunction) => Promise<void>)
        | ValidationChain[]
    >;
};

export function createRouter<T>(
    controller: T,
    routes: RouteConfig<T>[],
): Router {
    const router = Router();

    routes.forEach(({ method, path, action, middlewares = [] }) => {
        router[method](
            path,
            ...middlewares,
            async (req: Request, res: Response, next: NextFunction) => {
                try {
                    await (controller[action] as any)(req, res, next);
                } catch (error) {
                    next(error);
                }
            },
        );
    });

    return router;
}
