import { inject, injectable } from 'inversify';
import { BaseController } from './BaseController';
import { RoleService } from '../services/roleService';

@injectable()
export class RoleController extends BaseController<RoleService> {
    protected service: RoleService;
    constructor(@inject(RoleService) roleService: RoleService) {
        super();
        this.service = roleService;
    }
}
