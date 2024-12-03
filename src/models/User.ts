export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    phone?: string | null;
    status: number;
    roleId: number;
    password: string;
    token?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
