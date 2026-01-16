import { Request, Response } from 'express';
import { UserController } from '../../../controllers/userController';
import { UserService } from '../../../services/userService';

jest.mock('../../../services/userService');
jest.mock('../../../config/i18n', () => ({
    __esModule: true,
    default: {
        __: jest.fn((key: string) => key),
    },
}));

describe('UserController Unit Tests', () => {
    let userController: UserController;
    let mockUserService: jest.Mocked<UserService>;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUserService = {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getAll: jest.fn(),
        } as unknown as jest.Mocked<UserService>;
        userController = new UserController(mockUserService);

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
        it('should create user successfully', async () => {
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                username: 'john.doe@example.com',
                password: 'password123',
                phone: '1234567890',
                roleId: '1',
                status: '1',
            };
            mockReq.body = userData;
            mockRes.__ = jest.fn((key: string) => key);
            mockUserService.create = jest
                .fn()
                .mockResolvedValue({ id: 1, ...userData });

            await userController.create(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockUserService.create).toHaveBeenCalledWith(mockReq.body);
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });

        it('should handle error during creation', async () => {
            mockReq.body = { username: 'test@test.com' };
            const error = new Error('Creation failed');
            mockUserService.create = jest.fn().mockRejectedValue(error);

            await userController.create(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        it('should get user by ID successfully', async () => {
            mockReq.params = { id: '1' };
            mockRes.__ = jest.fn((key: string) => key);
            const user = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                username: 'john.doe@example.com',
                phone: '1234567890',
                roleId: '1',
                status: '1',
            };
            mockUserService.getById = jest.fn().mockResolvedValue(user);

            await userController.getById(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockUserService.getById).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when user not found', async () => {
            mockReq.params = { id: '999' };
            mockRes.__ = jest.fn((key: string) => key);
            mockUserService.getById = jest.fn().mockResolvedValue(null);

            await userController.getById(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        it('should handle error during fetch', async () => {
            mockReq.params = { id: '1' };
            const error = new Error('Fetch failed');
            mockUserService.getById = jest.fn().mockRejectedValue(error);

            await userController.getById(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('update', () => {
        it('should update user successfully', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { firstName: 'Jane', lastName: 'Doe' };
            mockRes.__ = jest.fn((key: string) => key);
            mockUserService.getById = jest
                .fn()
                .mockResolvedValue({
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                });
            mockUserService.update = jest
                .fn()
                .mockResolvedValue({ id: 1, ...mockReq.body });

            await userController.update(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockUserService.getById).toHaveBeenCalledWith(1);
            expect(mockUserService.update).toHaveBeenCalledWith(
                1,
                mockReq.body,
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when user not found', async () => {
            mockReq.params = { id: '999' };
            mockReq.body = { firstName: 'Jane' };
            mockRes.__ = jest.fn((key: string) => key);
            mockUserService.getById = jest.fn().mockResolvedValue(null);

            await userController.update(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockUserService.getById).toHaveBeenCalledWith(999);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        it('should handle error during update', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { firstName: 'Jane' };
            const error = new Error('Update failed');
            mockUserService.getById = jest
                .fn()
                .mockResolvedValue({ id: 1, firstName: 'John' });
            mockUserService.update = jest.fn().mockRejectedValue(error);

            await userController.update(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getAll', () => {
        it('should get all users successfully', async () => {
            mockReq.query = { page: '1', limit: '10' };
            mockRes.__ = jest.fn((key: string) => key);
            const result = {
                items: [{ id: 1, firstName: 'John', lastName: 'Doe' }],
                pagination: { currentPage: 1, totalPages: 1 },
            };
            mockUserService.getAll = jest.fn().mockResolvedValue(result);

            await userController.getAll(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockUserService.getAll).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should handle error during fetch all', async () => {
            mockReq.query = {};
            const error = new Error('Fetch failed');
            mockUserService.getAll = jest.fn().mockRejectedValue(error);

            await userController.getAll(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('delete', () => {
        it('should delete user successfully', async () => {
            mockReq.params = { id: '1' };
            mockRes.__ = jest.fn((key: string) => key);
            mockUserService.getById = jest
                .fn()
                .mockResolvedValue({ id: 1, firstName: 'John' });
            mockUserService.delete = jest.fn().mockResolvedValue(undefined);

            await userController.delete(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockUserService.getById).toHaveBeenCalledWith(1);
            expect(mockUserService.delete).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when user not found', async () => {
            mockReq.params = { id: '999' };
            mockRes.__ = jest.fn((key: string) => key);
            mockUserService.getById = jest.fn().mockResolvedValue(null);

            await userController.delete(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockUserService.getById).toHaveBeenCalledWith(999);
            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        it('should handle error during deletion', async () => {
            mockReq.params = { id: '1' };
            const error = new Error('Deletion failed');
            mockUserService.getById = jest.fn().mockResolvedValue({ id: 1 });
            mockUserService.delete = jest.fn().mockRejectedValue(error);

            await userController.delete(
                mockReq as Request,
                mockRes as Response,
                mockNext,
            );

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
