import { inject, injectable } from 'inversify';
import { BaseController } from './BaseController';
import { PermissionService } from '../services/permissionService';
@injectable()
export class PermissionController extends BaseController<PermissionService> {
    protected service: PermissionService;
    constructor(
        @inject(PermissionService) permissionService: PermissionService,
    ) {
        super();
        this.service = permissionService;
    }
}
