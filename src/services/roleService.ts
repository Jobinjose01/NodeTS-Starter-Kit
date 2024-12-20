import { injectable } from 'inversify';
import { BaseService } from './BaseService';
import { Role } from '../models/Role';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@injectable()
export class RoleService extends BaseService<Role> {
    protected model: any;
    protected relatedModels: any;
    constructor() {
        super();
        this.model = prisma.role;
        this.relatedModels = [
            { relatedModel: prisma.user, foreignKey: 'roleId' },
            { relatedModel: prisma.rolePermission, foreignKey: 'roleId' },
        ];
    }
}
