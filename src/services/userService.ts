import { injectable } from 'inversify';
import { User } from '../models/User';
import { BaseService } from './BaseService';
import prisma from '../config/prismaClient';

@injectable()
export class UserService extends BaseService<User> {
    protected model: any;
    protected relatedModels: any;
    protected insertableFields: (keyof User)[];
    protected updatableFields: (keyof User)[];

    constructor() {
        super();
        this.model = prisma.user;
        this.relatedModels = [];

        // Define which fields can be inserted
        this.insertableFields = [
            'firstName',
            'lastName',
            'username',
            'phone',
            'password',
            'roleId',
            'status',
            'token',
            'createdAt',
            'updatedAt',
        ];

        // Define which fields can be updated
        this.updatableFields = [
            'firstName',
            'lastName',
            'username',
            'phone',
            'password',
            'roleId',
            'status',
            'updatedAt',
        ];
    }
}
