import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import { PaginationDTO } from '../dtos/PaginationDTO';

const prisma = new PrismaClient();

@injectable()
export abstract class BaseService<T> {
    protected abstract model: any;

    // Create a record
    async create(data: T): Promise<T> {
        return await this.model.create({
            data,
        });
    }

    // Get all records
    async getAll(
        filters: any,
        pages: { page?: number; limit?: number },
        orderBy: any = { id: 'desc' },
    ): Promise<any> {
        // Build dynamic `where` conditions
        const where: Record<string, any> = {
            deletedAt: null, // Default condition
        };

        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'string') {
                // String filters use `contains` with case-insensitivity
                where[key] = { contains: value };
            } else {
                // Non-string filters use equality
                where[key] = value;
            }
        });

        const totalRecords = await this.model.count({ where });

        const { page = 1, limit = 10 } = pages;

        const items = await this.model.findMany({
            where,
            orderBy,
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(totalRecords / limit);

        const pagination: PaginationDTO = {
            totalRecords,
            totalPages,
            currentPage: page,
            recordsPerPage: limit,
        };

        return {
            items,
            pagination,
        };
    }

    // Get a record by ID
    async getById(id: number): Promise<T | null> {
        return await this.model.findUnique({
            where: { id },
        });
    }

    // Update a record by ID
    async update(id: number, data: Partial<T>): Promise<T> {
        return await this.model.update({
            where: { id },
            data,
        });
    }

    // Delete a record by ID (soft delete for now)
    async delete(id: number): Promise<void> {
        await this.model.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
