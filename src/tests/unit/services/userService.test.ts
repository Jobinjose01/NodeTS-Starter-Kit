import { UserService } from '../../../services/userService';
import prisma from '../../../config/prismaClient';
import { User } from '../../../models/User';

jest.mock('../../../config/prismaClient', () => ({
    __esModule: true,
    default: {
        user: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    },
}));

describe('UserService Unit Tests', () => {
    let userService: UserService;

    beforeEach(() => {
        jest.clearAllMocks();
        userService = new UserService();
    });

    describe('create', () => {
        it('should create user successfully', async () => {
            const userData: Partial<User> = {
                firstName: 'John',
                lastName: 'Doe',
                username: 'john.doe@example.com',
                password: 'hashedpassword',
                phone: '1234567890',
                roleId: 1,
                status: 1,
            };

            (prisma.user.create as jest.Mock).mockResolvedValue({
                id: 1,
                ...userData,
            });

            const result = await userService.create(userData as User);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: expect.objectContaining(userData),
            });
            expect(result).toHaveProperty('id');
        });
    });

    describe('getById', () => {
        it('should get user by ID', async () => {
            const user = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                username: 'john.doe@example.com',
            };
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

            const result = await userService.getById(1);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1, deletedAt: null },
            });
            expect(result).toEqual(user);
        });

        it('should return null if user not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await userService.getById(999);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update user successfully', async () => {
            const updateData: Partial<User> = {
                firstName: 'Jane',
                lastName: 'Doe',
            };

            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
            (prisma.user.update as jest.Mock).mockResolvedValue({
                id: 1,
                ...updateData,
            });

            const result = await userService.update(1, updateData);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: expect.objectContaining(updateData),
            });
            expect(result).toHaveProperty('id');
        });
    });

    describe('delete', () => {
        it('should delete user successfully (soft delete)', async () => {
            (prisma.user.update as jest.Mock).mockResolvedValue({
                id: 1,
                deletedAt: new Date(),
            });

            await userService.delete(1);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { deletedAt: expect.any(Date) },
            });
        });
    });

    describe('getAll', () => {
        it('should get all users with pagination', async () => {
            const users = [
                { id: 1, firstName: 'John', lastName: 'Doe' },
                { id: 2, firstName: 'Jane', lastName: 'Smith' },
            ];
            (prisma.user.findMany as jest.Mock).mockResolvedValue(users);
            (prisma.user.count as jest.Mock).mockResolvedValue(2);

            const result = await userService.getAll({}, { page: 1, limit: 10 });

            expect(prisma.user.findMany).toHaveBeenCalled();
            expect(result.items).toEqual(users);
            expect(result.pagination.totalRecords).toBe(2);
        });
    });
});
