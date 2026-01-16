import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { handleUserResponse } from '../responseHandlers/UserResponseHandler';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { UserFilterDTO } from '../dtos/UserFilterDTO';
import { BaseController } from './BaseController';

@injectable()
export class UserController extends BaseController<UserService> {
    protected service: UserService;

    constructor(@inject(UserService) userService: UserService) {
        super();
        this.service = userService;
    }

    async createUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const {
            firstName,
            lastName,
            username,
            phone,
            password,
            roleId,
            status,
        } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData: User = {
            firstName,
            lastName,
            username,
            phone,
            roleId,
            status,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            const createdUser = await this.service.createUser(userData);
            res.status(201).json({
                message: res.__('user.USER_CREATED_SUCCESSFULLY'),
                result: handleUserResponse(createdUser),
            });
        } catch (error) {
            next(error);
        }
    }

    async updateUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const userId = parseInt(this.getParamAsString(req.params.id));
        const {
            firstName,
            lastName,
            username,
            phone,
            password,
            status,
            roleId,
        } = req.body;

        try {
            const userDataToUpdate: Partial<User> = {
                firstName,
                lastName,
                username,
                phone,
                status,
                roleId,
                updatedAt: new Date(),
            };

            // Only hash password if it's provided
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                userDataToUpdate.password = hashedPassword;
            }

            const user = await this.service.getUserById(userId);
            if (user) {
                const updatedUser = await this.service.updateUser(
                    userId,
                    userDataToUpdate,
                );
                if (updatedUser) {
                    res.status(200).json({
                        message: res.__('user.USER_UPDATED_SUCCESSFULLY'),
                        result: handleUserResponse(updatedUser),
                    });
                } else {
                    res.status(404).json({
                        message: res.__('user.FAILED_TO_UPDATE_USER'),
                    });
                }
            } else {
                res.status(404).json({
                    message: res.__('user.USER_NOT_FOUND'),
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async deleteUser(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const userId = parseInt(this.getParamAsString(req.params.id));
        try {
            await this.service.deleteUser(userId);
            res.status(200).json({
                message: res.__('user.USER_DELETED_SUCCESSFULLY'),
            });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === 'Record not found'
            ) {
                res.status(404).json({
                    message: res.__('user.USER_NOT_FOUND'),
                });
            } else {
                next(error);
            }
        }
    }

    async getUserById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const userId = parseInt(this.getParamAsString(req.params.id));
        try {
            const user = await this.service.getUserById(userId);
            if (user) {
                res.status(200).json({
                    message: res.__('user.USER_FETCHED'),
                    result: handleUserResponse(user),
                });
            } else {
                res.status(404).json({
                    message: res.__('user.USER_NOT_FOUND'),
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async getUsers(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const filters: UserFilterDTO = {
                id: req.query.id ? Number(req.query.id) : undefined,
                firstName: req.query.firstName as string,
                lastName: req.query.lastName as string,
                phone: req.query.phone as string,
                orderBy: req.query.orderBy as string,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 20,
            };

            const { users, pagination } =
                await this.service.getAllUsers(filters);
            if (users) {
                res.status(200).json({
                    message: res.__('user.USERS_FETCHED'),
                    result: {
                        items: handleUserResponse(users),
                        pagination,
                    },
                });
            } else {
                res.status(404).json({
                    message: res.__('user.NO_USERS_AVAILABLE'),
                });
            }
        } catch (error) {
            next(error);
        }
    }
}
