import { Prisma, PrismaClient } from '@prisma/client';
import { User } from '../models/User';
import { injectable } from 'inversify';
import { UserFilterDTO } from '../dtos/UserFilterDTO';
import { PaginationDTO } from '../dtos/PaginationDTO';
import { UserResponse } from '../types/UserResponse';

const prisma = new PrismaClient();

@injectable()
export class UserService {
    async createUser(data: User): Promise<User> {
        const token = data.token || ''; // Or any other default value you prefer

        const userData = {
            ...data,
            token, // Ensure token is always a string
        };

        const createdUser = await prisma.user.create({ data: userData });
        return createdUser;
    }

    async getUserById(userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user;
    }

    async getAllUsers(filters: UserFilterDTO): Promise<UserResponse> {
        const { id, firstName, lastName, phone, orderBy, page, limit } =
            filters;

        const where: Prisma.UserWhereInput = {};
        if (id) where.id = id;
        if (firstName) where.firstName = { contains: firstName };
        if (lastName) where.lastName = { contains: lastName };
        if (phone) where.phone = { contains: phone };

        const order: Prisma.UserOrderByWithRelationInput = orderBy
            ? { [orderBy.split(':')[0]]: orderBy.split(':')[1].toLowerCase() }
            : { id: 'desc' };

        const totalRecords = await prisma.user.count({
            where,
        });

        const users = await prisma.user.findMany({
            where,
            orderBy: order,
            skip: (page - 1) * limit,
            take: limit,
            /*  include: { 
        role: true,
      }, */
        });

        const totalPages = Math.ceil(totalRecords / limit);

        const pagination: PaginationDTO = {
            totalRecords,
            totalPages,
            currentPage: page,
            recordsPerPage: limit,
        };

        return {
            users,
            pagination,
        };
    }

    async updateUser(
        userId: number,
        data: Partial<User>,
    ): Promise<User | null> {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: data,
        });
        return updatedUser;
    }

    async deleteUser(userId: number): Promise<void> {
        await prisma.user.delete({
            where: {
                id: userId,
            },
        });
    }
}
