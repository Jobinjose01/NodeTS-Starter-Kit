import { RoleDTO } from './RoleDTO';

export interface UserDTO {
    id?: number | undefined;
    firstName: string;
    lastName: string;
    username: string;
    phone?: string | null | undefined;
    roleId: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    role?: RoleDTO;
}
