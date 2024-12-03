export interface Role {
    id?: number;
    name: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
