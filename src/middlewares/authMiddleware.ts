import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../config/prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: res.__('login.NO_TOKEN_PROVIDED'),
        });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const userId = decoded.user.id;

        // Fetch the user from the database
        const storedUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!storedUser) {
            return res.status(401).json({ message: res.__('USER_NOT_FOUND') });
        }

        // Compare the token from the header with the stored token
        // This assumes you store the token in your database
        if (storedUser.token !== token) {
            return res.status(401).json({
                status: 'fail',
                message: res.__('INVALID_TOKEN'),
            });
        }

        // Attach decoded token to request for use in controllers
        (req as any).user = decoded;

        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res
            .status(401)
            .json({ status: 'fail', message: res.__('UNAUTHORIZED') });
    }
};

export default authMiddleware;
