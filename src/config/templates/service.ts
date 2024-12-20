import { injectable } from 'inversify';
import { BaseService } from './BaseService';
import { ${ModelName} } from '../models/${ModelName}';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
@injectable()
export class ${ModelName}Service extends BaseService<${ModelName}> {
    protected model: any;
    protected relatedModels: any;
    constructor() {
        super();
        this.model = prisma.${modelName};
    }
}