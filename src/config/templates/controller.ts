import { inject, injectable } from 'inversify';
import { BaseController } from './BaseController';
import { ${ModelName}Service } from '../services/${modelName}Service';

@injectable()
export class ${ModelName}Controller extends BaseController<${ModelName}Service> {
    protected service: ${ModelName}Service;
    constructor(@inject(${ModelName}Service) ${modelName}Service: ${ModelName}Service) {
        super();
        this.service = ${modelName}Service;
    }
}
