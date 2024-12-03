import { PrismaClient } from '@prisma/client';
import { User } from '../models/User';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PermissionService } from './permissionService';
import { handleUserResponse } from '../responseHandlers/UserResponseHandler';

@injectable()
export class LoginService {
    private prisma = new PrismaClient();
    private permissionService: PermissionService;
    private secret: string = process.env.JWT_SECRET || 'your_jwt_secret'; // Ensure this is set in your environment

    constructor(
        @inject(PermissionService) permissionService: PermissionService,
    ) {
        this.permissionService = permissionService;
    }

    async getUserByUsername(username: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        return user;
    }

    async generateToken(user: User) {
        if (!user || user.id === undefined) {
            return null;
        }

        const scope = await this.permissionService.getById(user.roleId);
        const payload = {
            user: handleUserResponse(user),
            scope: scope,
        };
        const token = jwt.sign(payload, this.secret);
        await this.updatedUserWithToken(user.id, token);
        return token; // Adjust the expiration as needed
    }

    async validateUser(
        username: string,
        password: string,
    ): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { username },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        // Return null if the user is not found or the password is incorrect
        return null;
    }

    async updatedUserWithToken(userId: number, token: string) {
        const data: Partial<User> = {
            token,
            updatedAt: new Date(),
        };

        await this.prisma.user.update({
            where: { id: userId },
            data: data,
        });
    }

    async deleteToken(userId: number, data: Partial<User>): Promise<void> {
        // Token exists, so update it
        await this.prisma.user.update({
            where: { id: userId },
            data: data, // Set token to null
        });
    }
}
