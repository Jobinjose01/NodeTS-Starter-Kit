import { Request, Response } from 'express';
import { RoleController } from '../../../controllers/roleController';
import { RoleService } from '../../../services/roleService';

jest.mock('../../../services/roleService');
jest.mock('../../../config/i18n', () => ({
    __esModule: true,
    default: {
        __: jest.fn((key: string) => key),
    },
}));

describe('RoleController Unit Tests', () => {
    let roleController: RoleController;
    let mockRoleService: jest.Mocked<RoleService>;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRoleService = {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getAll: jest.fn(),
        } as unknown as jest.Mocked<RoleService>;
        roleController = new RoleController(mockRoleService);

        mockReq = {
            params: {},
            body: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            __: jest.fn((key: string) => key),
        };
        mockNext = jest.fn();
    });

    describe('create', () => {
        it('should create role successfully', async () => {
            const roleData = {
                name: 'Manager',
                status: 1,
            };
            mockReq.body = roleData;
            mockRes.__ = jest.fn((key: string) => key);
            mockRoleService.create = jest
                .fn()
                .mockResolvedValue({ id: 1, ...roleData });

            await roleController.create(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockRoleService.create).toHaveBeenCalledWith(mockReq.body);
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });

        it('should handle error during creation', async () => {
            mockReq.body = { name: 'Test Role' };
            const error = new Error('Creation failed');
            mockRoleService.create = jest.fn().mockRejectedValue(error);

            await roleController.create(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        it('should get role by ID successfully', async () => {
            mockReq.params = { id: '1' };
            mockRes.__ = jest.fn((key: string) => key);
            const role = { id: 1, name: 'Admin', status: 1 };
            mockRoleService.getById = jest.fn().mockResolvedValue(role);

            await roleController.getById(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockRoleService.getById).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when role not found', async () => {
            mockReq.params = { id: '999' };
            mockRes.__ = jest.fn((key: string) => key);
            mockRoleService.getById = jest.fn().mockResolvedValue(null);

            await roleController.getById(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('update', () => {
        it('should update role successfully', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { name: 'Updated Role' };
            mockRes.__ = jest.fn((key: string) => key);
            mockRoleService.update = jest
                .fn()
                .mockResolvedValue({ id: 1, ...mockReq.body });

            await roleController.update(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockRoleService.update).toHaveBeenCalledWith(
                1,
                mockReq.body,
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when role not found', async () => {
            mockReq.params = { id: '999' };
            mockReq.body = { name: 'Updated Role' };
            mockRes.__ = jest.fn((key: string) => key);
            mockRoleService.update = jest
                .fn()
                .mockRejectedValue(new Error('Record not found'));

            await roleController.update(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getAll', () => {
        it('should get all roles successfully', async () => {
            mockReq.query = { page: '1', limit: '10' };
            mockRes.__ = jest.fn((key: string) => key);
            const result = {
                items: [{ id: 1, name: 'Admin', status: 1 }],
                pagination: { currentPage: 1, totalPages: 1 },
            };
            mockRoleService.getAll = jest.fn().mockResolvedValue(result);

            await roleController.getAll(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockRoleService.getAll).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });

    describe('delete', () => {
        it('should delete role successfully', async () => {
            mockReq.params = { id: '1' };
            mockRes.__ = jest.fn((key: string) => key);
            mockRoleService.delete = jest.fn().mockResolvedValue(undefined);

            await roleController.delete(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockRoleService.delete).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });
});
