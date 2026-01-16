import { RoleService } from '../../../services/roleService';
import prisma from '../../../config/prismaClient';
import { Role } from '../../../models/Role';

jest.mock('../../../config/prismaClient', () => ({
    __esModule: true,
    default: {
        role: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        user: {
            count: jest.fn(),
        },
        rolePermission: {
            count: jest.fn(),
        },
    },
}));

describe('RoleService Unit Tests', () => {
    let roleService: RoleService;

    beforeEach(() => {
        jest.clearAllMocks();
        roleService = new RoleService();
    });

    describe('create', () => {
        it('should create role successfully', async () => {
            const roleData: Partial<Role> = {
                name: 'Manager',
                status: 1,
            };

            (prisma.role.create as jest.Mock).mockResolvedValue({
                id: 1,
                ...roleData,
            });

            const result = await roleService.create(roleData as Role);

            expect(prisma.role.create).toHaveBeenCalledWith({
                data: expect.objectContaining(roleData),
            });
            expect(result).toHaveProperty('id');
            expect(result.name).toBe('Manager');
        });
    });

    describe('getById', () => {
        it('should get role by ID', async () => {
            const role = { id: 1, name: 'Admin', status: 1 };
            (prisma.role.findUnique as jest.Mock).mockResolvedValue(role);

            const result = await roleService.getById(1);

            expect(prisma.role.findUnique).toHaveBeenCalledWith({
                where: { id: 1, deletedAt: null },
            });
            expect(result).toEqual(role);
        });

        it('should return null if role not found', async () => {
            (prisma.role.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await roleService.getById(999);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update role successfully', async () => {
            const updateData: Partial<Role> = {
                name: 'Updated Role',
                status: 1,
            };

            (prisma.role.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
            (prisma.role.update as jest.Mock).mockResolvedValue({
                id: 1,
                ...updateData,
            });

            const result = await roleService.update(1, updateData);

            expect(prisma.role.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: expect.objectContaining(updateData),
            });
            expect(result).toHaveProperty('id');
        });
    });

    describe('delete', () => {
        it('should delete role successfully (soft delete)', async () => {
            // Mock findUnique to return a role (exists check)
            (prisma.role.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'Test Role',
                deletedAt: null,
            });

            // Mock count for related models check
            (prisma.user.count as jest.Mock).mockResolvedValue(0);
            (prisma.rolePermission.count as jest.Mock).mockResolvedValue(0);

            (prisma.role.update as jest.Mock).mockResolvedValue({
                id: 1,
                deletedAt: new Date(),
            });

            await roleService.delete(1);

            expect(prisma.role.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { deletedAt: expect.any(Date) },
            });
        });
    });

    describe('getAll', () => {
        it('should get all roles with pagination', async () => {
            const roles = [
                { id: 1, name: 'Admin', status: 1 },
                { id: 2, name: 'Manager', status: 1 },
            ];
            (prisma.role.findMany as jest.Mock).mockResolvedValue(roles);
            (prisma.role.count as jest.Mock).mockResolvedValue(2);

            const result = await roleService.getAll({}, { page: 1, limit: 10 });

            expect(prisma.role.findMany).toHaveBeenCalled();
            expect(result.items).toEqual(roles);
            expect(result.pagination.totalRecords).toBe(2);
        });
    });
});
