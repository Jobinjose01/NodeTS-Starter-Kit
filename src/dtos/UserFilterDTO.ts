export interface UserFilterDTO {
    id?: number;
    firstName?: string;
    lastName?: string;
    phone?: string;
    orderBy?: string;
    page: number;
    limit: number;
}
