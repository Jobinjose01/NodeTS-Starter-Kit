import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
import { RolePermissionDTO } from '../dtos/RolePermission';
import { RolePermissionResponse } from '../types/RolePermissionResponse';

const prisma = new PrismaClient();

@injectable()
export class PermissionService {
    async createPermission(
        data: RolePermissionDTO,
    ): Promise<RolePermissionResponse> {
        const { roleId, permissions } = data;

        await this.deletePermissionByRoleId(roleId);

        const rolePermissions = permissions.map((permission) => ({
            roleId,
            ...permission,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        return await prisma.rolePermission.createMany({
            data: rolePermissions,
        });
    }

    async getPermissionByRoleId(roleId: number) {
        return await prisma.rolePermission.findMany({
            where: { roleId },
            include: { permission: true },
        });
    }

    async deletePermissionByRoleId(roleId: number): Promise<void> {
        await prisma.rolePermission.deleteMany({
            where: { roleId },
        });
    }
}
