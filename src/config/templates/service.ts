import { injectable } from 'inversify';
import { BaseService } from './BaseService';
import { ${ModelName} } from '../models/${ModelName}';
import prisma from '../config/prismaClient';
@injectable()
export class ${ModelName}Service extends BaseService<${ModelName}> {
    protected model: any;
    protected relatedModels: any;
    protected insertableFields: (keyof ${ModelName})[] = [];
    protected updatableFields: (keyof ${ModelName})[] = [];
    protected customIncludes: any;
    constructor() {
        super();
        this.model = prisma.${modelName};
    }
}