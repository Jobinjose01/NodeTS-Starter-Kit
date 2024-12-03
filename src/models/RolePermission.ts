export interface RolePermission {
    id?: number;
    roleId: number;
    permissionId: number;
    add: number;
    edit: number;
    remove: number;
    view: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
