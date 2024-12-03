export interface RolePermissionDTO {
    roleId: number;
    permissions: {
        permissionId: number;
        add?: number;
        edit?: number;
        remove?: number;
        view?: number;
    }[];
}
