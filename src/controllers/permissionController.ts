import { NextFunction, Request, Response } from 'express';
import { PermissionService } from '../services/permissionService';
import { inject, injectable } from 'inversify';
import { RolePermissionDTO } from '../dtos/RolePermission';

@injectable()
export class PermissionController {
    private permissionService: PermissionService;

    constructor(
        @inject(PermissionService) permissionService: PermissionService,
    ) {
        this.permissionService = permissionService;
    }

    async createPermission(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { roleId, permissions }: RolePermissionDTO = req.body;

            const result = await this.permissionService.createPermission({
                roleId,
                permissions,
            });
            res.status(201).json({
                result: result,
                message: res.__('permission.PERMISSION_CREATED'),
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePermission(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const roleId = parseInt(req.params.id);
        try {
            await this.permissionService.deletePermissionByRoleId(roleId);
            res.status(200).json({
                message: res.__('permission.PERMISSION_DELETED'),
            });
        } catch (error) {
            next(error);
        }
    }

    async getPermissionByRoleId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const roleId = parseInt(req.params.id);
        try {
            const permissions =
                await this.permissionService.getPermissionByRoleId(roleId);
            if (permissions) {
                res.status(200).json({
                    message: res.__('permission.PERMISSION_FETCHED'),
                    result: permissions,
                });
            } else {
                res.status(404).json({
                    message: res.__('permission.PERMISSION_NOT_FOUND'),
                });
            }
        } catch (error) {
            next(error);
        }
    }
}
