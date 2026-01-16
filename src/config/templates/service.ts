import { injectable } from 'inversify';
import { BaseService } from './BaseService';
import { ${ModelName} } from '../models/${ModelName}';
import prisma from '../config/prismaClient';
@injectable()
export class ${ModelName}Service extends BaseService<${ModelName}> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected model: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected relatedModels: any;
    protected insertableFields: (keyof ${ModelName})[] = [];
    protected updatableFields: (keyof ${ModelName})[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected customIncludes: any;
    constructor() {
        super();
        this.model = prisma.${modelName};
    }
}