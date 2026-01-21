import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { handleUserResponse } from '../responseHandlers/UserResponseHandler';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { BaseController } from './BaseController';

@injectable()
export class UserController extends BaseController<UserService> {
    protected service: UserService;

    constructor(@inject(UserService) userService: UserService) {
        super();
        this.service = userService;
    }

    // Override create to handle password hashing
    async create(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
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

            const createdUser = await this.service.create(userData);
            res.status(201).json({
                message: res.__('user.USER_CREATED_SUCCESSFULLY'),
                result: handleUserResponse(createdUser),
            });
        } catch (error) {
            next(error);
        }
    }

    // Override update to handle password hashing and user response formatting
    async update(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = parseInt(this.getParamAsString(req.params.id));

            // Check if record exists first
            const existingUser = await this.service.getById(id);
            if (!existingUser) {
                res.status(404).json({
                    message: res.__('user.USER_NOT_FOUND'),
                });
                return;
            }

            const {
                firstName,
                lastName,
                username,
                phone,
                password,
                status,
                roleId,
            } = req.body;

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

            const updatedUser = await this.service.update(id, userDataToUpdate);
            res.status(200).json({
                message: res.__('user.USER_UPDATED_SUCCESSFULLY'),
                result: handleUserResponse(updatedUser),
            });
        } catch (error) {
            next(error);
        }
    }

    // Override delete to use custom error message
    async delete(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = parseInt(this.getParamAsString(req.params.id));

            // Check if record exists first
            const existingUser = await this.service.getById(id);
            if (!existingUser) {
                res.status(404).json({
                    message: res.__('user.USER_NOT_FOUND'),
                });
                return;
            }

            await this.service.delete(id);
            res.status(200).json({
                message: res.__('user.USER_DELETED_SUCCESSFULLY'),
            });
        } catch (error) {
            next(error);
        }
    }

    // Override getById to handle user response formatting
    async getById(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = parseInt(this.getParamAsString(req.params.id));
            const user = await this.service.getById(id);
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

    // Override getAll to handle user response formatting
    async getAll(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { page = 1, limit = 20, orderBy, ...queryParams } = req.query;

            const filters = this.buildFilters(queryParams);

            const pagination = {
                page: Number(page),
                limit: Number(limit),
            };

            let sort: Record<string, string> | undefined;
            if (typeof orderBy === 'string') {
                const [key, value] = orderBy.split(':');
                sort = { [key]: value };
            }

            const result = await this.service.getAll(filters, pagination, sort);

            res.status(200).json({
                message: res.__('user.USERS_FETCHED'),
                result: {
                    items: handleUserResponse(result.items),
                    pagination: result.pagination,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
