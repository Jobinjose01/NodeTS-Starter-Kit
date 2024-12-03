import { RolePermission } from '../models/RolePermission';
import { RolePermissionDTO } from './RolePermission';
import { UserDTO } from './UserDTO';

export interface RoleDTO {
    id: number;
    name: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    users?: UserDTO[];
    rolePermissions?: RolePermission[];
}
