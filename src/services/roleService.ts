import { injectable } from 'inversify';
import { BaseService } from './BaseService';
import { Role } from '../models/Role';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@injectable()
export class RoleService extends BaseService<Role> {
    protected model: any;
    constructor() {
        super();
        this.model = prisma.role;
    }
}
