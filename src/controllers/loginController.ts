import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoginService } from '../services/loginService';
import { UserService } from '../services/userService';
import { User } from '../models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { handleUserResponse } from '../responseHandlers/UserResponseHandler';

@injectable()
export class LoginController {
    private loginService: LoginService;
    private userService: UserService;
    private jwtSecret: string = process.env.JWT_SECRET || 'your_jwt_secret';

    constructor(
        @inject(LoginService) loginService: LoginService,
        @inject(UserService) userService: UserService,
    ) {
        this.loginService = loginService;
        this.userService = userService;
    }

    async login(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const { username, password } = req.body;
        try {
            const user = await this.loginService.validateUser(
                username,
                password,
            );

            if (!user) {
                res.status(401).json({
                    status: 'fail',
                    message: res.__('login.AUTHENTICATION_FAILED'),
                });
                return;
            }

            const token = await this.loginService.generateToken(user);
            if (!token) {
                res.status(401).json({
                    message: res.__('login.FAILED_TO_GENERATE_TOKEN'),
                });
                return;
            }
            const loginUserResponse = {
                ...handleUserResponse(user),
                token,
            };

            res.json({
                result: loginUserResponse,
                message: res.__('login.LOGGED_IN_SUCCESSFULLY'),
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                res.status(400).json({
                    message: res.__('login.NO_TOKEN_PROVIDED'),
                });
                return;
            }
            const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
            const userId = decoded.user.id;

            await this.deleteToken(userId);
            res.status(200).json({
                message: res.__('login.LOGGED_OUT_SUCCESSFULLY'),
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteToken(userId: number): Promise<void> {
        const userDataToUpdate: Partial<User> = {
            token: null,
            updatedAt: new Date(),
        };
        await this.loginService.deleteToken(userId, userDataToUpdate);
    }
}
