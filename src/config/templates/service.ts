import { injectable } from 'inversify';
import { BaseService } from './BaseService';
import { ${ModelName} } from '../models/${ModelName}';
import  prisma  from '../prismaClient';
@injectable()
export class ${ModelName}Service extends BaseService<${ModelName}> {
    protected model: any;
    protected relatedModels: any;
    constructor() {
        super();
        this.model = prisma.${modelName};
    }
}