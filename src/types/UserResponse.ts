import { PaginationDTO } from '../dtos/PaginationDTO';
import { UserDTO } from '../dtos/UserDTO';

export interface UserResponse {
    users: UserDTO[];
    pagination: PaginationDTO;
}
