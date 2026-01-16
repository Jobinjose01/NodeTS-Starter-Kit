import { Request, Response, NextFunction } from 'express';
import { ${ModelName}Controller } from '../../../controllers/${modelName}Controller';
import { ${ModelName}Service } from '../../../services/${modelName}Service';

jest.mock('../../../services/${modelName}Service');
jest.mock('../../../config/i18n', () => ({
    __esModule: true,
    default: {
        __: jest.fn((key: string) => key),
    },
}));

describe('${ModelName}Controller Unit Tests', () => {
    let ${modelName}Controller: ${ModelName}Controller;
    let mock${ModelName}Service: jest.Mocked<${ModelName}Service>;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mock${ModelName}Service = {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            getAll: jest.fn(),
        } as any;
        ${modelName}Controller = new ${ModelName}Controller(mock${ModelName}Service);

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
        it('should create ${modelName} successfully', async () => {
            mockReq.body = { ${testCreateData} };
            mockRes.__ = jest.fn((key: string) => key);
            mock${ModelName}Service.create = jest.fn().mockResolvedValue({ id: 1, ${testCreateData} });

            await ${modelName}Controller.create(mockReq as Request, mockRes as Response, mockNext);

            expect(mock${ModelName}Service.create).toHaveBeenCalledWith(mockReq.body);
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });

        it('should handle error during creation', async () => {
            mockReq.body = { ${testCreateData} };
            const error = new Error('Creation failed');
            mock${ModelName}Service.create = jest.fn().mockRejectedValue(error);

            await ${modelName}Controller.create(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getById', () => {
        it('should get ${modelName} by ID successfully', async () => {
            mockReq.params = { id: '1' };
            mockRes.__ = jest.fn((key: string) => key);
            const ${modelName} = { id: 1, ${testCreateData} };
            mock${ModelName}Service.getById = jest.fn().mockResolvedValue(${modelName});

            await ${modelName}Controller.getById(mockReq as Request, mockRes as Response, mockNext);

            expect(mock${ModelName}Service.getById).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when ${modelName} not found', async () => {
            mockReq.params = { id: '999' };
            mockRes.__ = jest.fn((key: string) => key);
            mock${ModelName}Service.getById = jest.fn().mockResolvedValue(null);

            await ${modelName}Controller.getById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        it('should handle error during fetch', async () => {
            mockReq.params = { id: '1' };
            const error = new Error('Fetch failed');
            mock${ModelName}Service.getById = jest.fn().mockRejectedValue(error);

            await ${modelName}Controller.getById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('update', () => {
        it('should update ${modelName} successfully', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { ${testUpdateData} };
            mockRes.__ = jest.fn((key: string) => key);
            mock${ModelName}Service.update = jest.fn().mockResolvedValue({ id: 1, ${testUpdateData} });

            await ${modelName}Controller.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mock${ModelName}Service.update).toHaveBeenCalledWith(1, mockReq.body);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when ${modelName} not found', async () => {
            mockReq.params = { id: '999' };
            mockReq.body = { ${testUpdateData} };
            mockRes.__ = jest.fn((key: string) => key);
            mock${ModelName}Service.update = jest.fn().mockResolvedValue(null);

            await ${modelName}Controller.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(404);
        });

        it('should handle error during update', async () => {
            mockReq.params = { id: '1' };
            mockReq.body = { ${testUpdateData} };
            const error = new Error('Update failed');
            mock${ModelName}Service.update = jest.fn().mockRejectedValue(error);

            await ${modelName}Controller.update(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('getAll', () => {
        it('should get all ${modelName}s successfully', async () => {
            mockReq.query = { page: '1', limit: '10' };
            mockRes.__ = jest.fn((key: string) => key);
            const result = { items: [{ id: 1, ${testCreateData} }], pagination: {} };
            mock${ModelName}Service.getAll = jest.fn().mockResolvedValue(result);

            await ${modelName}Controller.getAll(mockReq as Request, mockRes as Response, mockNext);

            expect(mock${ModelName}Service.getAll).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should handle error during fetch all', async () => {
            mockReq.query = {};
            const error = new Error('Fetch failed');
            mock${ModelName}Service.getAll = jest.fn().mockRejectedValue(error);

            await ${modelName}Controller.getAll(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });

    describe('delete', () => {
        it('should delete ${modelName} successfully', async () => {
            mockReq.params = { id: '1' };
            mockRes.__ = jest.fn((key: string) => key);
            // Mock getById to return an existing item (BaseController checks existence before delete)
            mock${ModelName}Service.getById = jest.fn().mockResolvedValue({ id: 1 });
            mock${ModelName}Service.delete = jest.fn().mockResolvedValue(undefined);

            await ${modelName}Controller.delete(mockReq as Request, mockRes as Response, mockNext);

            expect(mock${ModelName}Service.getById).toHaveBeenCalledWith(1);
            expect(mock${ModelName}Service.delete).toHaveBeenCalledWith(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should handle error during deletion', async () => {
            mockReq.params = { id: '1' };
            const error = new Error('Deletion failed');
            // Mock getById to return an existing item first
            mock${ModelName}Service.getById = jest.fn().mockResolvedValue({ id: 1 });
            mock${ModelName}Service.delete = jest.fn().mockRejectedValue(error);

            await ${modelName}Controller.delete(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(error);
        });
    });
});
