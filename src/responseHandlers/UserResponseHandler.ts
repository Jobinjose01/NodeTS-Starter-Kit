import { UserDTO } from '../dtos/UserDTO';

export function handleUserResponse(
    user: UserDTO | UserDTO[],
): UserDTO | UserDTO[] {
    const usersArray = Array.isArray(user) ? user : [user];

    const userDTOs = usersArray.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        username: u.username,
        phone: u.phone,
        roleId: u.roleId,
        status: u.status,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        role: u.role,
    }));

    return Array.isArray(user) ? userDTOs : userDTOs[0];
}
