import { injectable } from 'inversify';
import { BaseService } from './BaseService';
import { RolePermission } from '../models/RolePermission';
import prisma from '../config/prismaClient';

@injectable()
export class PermissionService extends BaseService<RolePermission> {
    protected model: any;
    protected relatedModels: any;
    constructor() {
        super();
        this.model = prisma.rolePermission;
    }

    async create(data: any): Promise<any> {
        const { roleId, permissions } = data;

        await this.delete(roleId);

        const rolePermissions = permissions.map((permission: any) => ({
            roleId,
            ...permission,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        return await prisma.rolePermission.createMany({
            data: rolePermissions,
        });
    }

    async getById(roleId: number): Promise<any> {
        return await prisma.rolePermission.findMany({
            where: { roleId },
            include: { permission: true },
        });
    }

    async delete(roleId: number): Promise<void> {
        await prisma.rolePermission.deleteMany({
            where: { roleId },
        });
    }
}
