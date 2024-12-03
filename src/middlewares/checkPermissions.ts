import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

const checkPermissions = (
    requiredPermissions: {
        permission: string;
        action: 'add' | 'edit' | 'remove' | 'view';
    }[],
) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(401).json({ message: res.__('UNAUTHORIZED') });
                return; // End the cycle
            }

            const decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET || 'jwt_secret',
            ) as JwtPayload;
            const userId = decodedToken.user.id;

            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    role: {
                        include: {
                            rolePermissions: {
                                include: {
                                    permission: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!user) {
                res.status(404).json({
                    status: 'fail',
                    message: res.__('user.USER_NOT_FOUND'),
                });
                return; // End the cycle
            }

            const userPermissions = user.role.rolePermissions.map(
                (rolePermission) => ({
                    permission: rolePermission.permission.name,
                    actions: {
                        add: rolePermission.add,
                        edit: rolePermission.edit,
                        remove: rolePermission.remove,
                        view: rolePermission.view,
                    },
                }),
            );

            const hasPermission = requiredPermissions.every((reqPerm) => {
                const userPerm = userPermissions.find(
                    (up) => up.permission === reqPerm.permission,
                );
                return userPerm && userPerm.actions[reqPerm.action] === 1;
            });

            if (!hasPermission) {
                res.status(403).json({
                    status: 'fail',
                    message: res.__('NOT_AUTHORIZED_ACTION'),
                });
                return; // End the cycle
            }

            next(); // Proceed if permissions are valid
        } catch (error) {
            next(error); // Pass errors to error-handling middleware
        }
    };
};

export default checkPermissions;
