import { ${ModelName}Service } from '../../../services/${modelName}Service';
import prisma from '../../../config/prismaClient';

jest.mock('../../../config/prismaClient', () => ({
    __esModule: true,
    default: {
        ${modelName}: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    },
}));

describe('${ModelName}Service Unit Tests', () => {
    let ${modelName}Service: ${ModelName}Service;

    beforeEach(() => {
        jest.clearAllMocks();
        ${modelName}Service = new ${ModelName}Service();
    });

    describe('create', () => {
        it('should create ${modelName} successfully', async () => {
            const ${modelName}Data: any = { ${testCreateData} };

            (prisma.${modelName}.create as jest.Mock).mockResolvedValue({ id: 1, ...${modelName}Data });

            const result = await ${modelName}Service.create(${modelName}Data);

            expect(prisma.${modelName}.create).toHaveBeenCalledWith({
                data: expect.objectContaining(${modelName}Data),
            });
            expect(result).toHaveProperty('id');
        });
    });

    describe('getById', () => {
        it('should get ${modelName} by ID', async () => {
            const ${modelName} = { id: 1, ${testCreateData} };
            (prisma.${modelName}.findUnique as jest.Mock).mockResolvedValue(${modelName});

            const result = await ${modelName}Service.getById(1);

            expect(prisma.${modelName}.findUnique).toHaveBeenCalledWith({
                where: { id: 1, deletedAt: null },
            });
            expect(result).toEqual(${modelName});
        });

        it('should return null if ${modelName} not found', async () => {
            (prisma.${modelName}.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await ${modelName}Service.getById(999);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('should update ${modelName} successfully', async () => {
            const updateData: any = { ${testUpdateData} };

            // Mock getById to return an existing item (required for existence check)
            (prisma.${modelName}.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
            (prisma.${modelName}.update as jest.Mock).mockResolvedValue({ id: 1, ...updateData });

            const result = await ${modelName}Service.update(1, updateData);

            expect(prisma.${modelName}.update).toHaveBeenCalledWith({
                where: { id: 1, deletedAt: null },
                data: expect.objectContaining(updateData),
            });
            expect(result).toHaveProperty('id');
        });
    });

    describe('delete', () => {
        it('should delete ${modelName} successfully (soft delete)', async () => {
            (prisma.${modelName}.update as jest.Mock).mockResolvedValue({ id: 1, deletedAt: new Date() });

            await ${modelName}Service.delete(1);

            expect(prisma.${modelName}.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { deletedAt: expect.any(Date) },
            });
        });
    });

    describe('getAll', () => {
        it('should get all ${modelName}s with pagination', async () => {
            const ${modelName}s = [{ id: 1, ${testCreateData} }];
            (prisma.${modelName}.findMany as jest.Mock).mockResolvedValue(${modelName}s);
            (prisma.${modelName}.count as jest.Mock).mockResolvedValue(1);

            const result = await ${modelName}Service.getAll({}, { page: 1, limit: 10 });

            expect(prisma.${modelName}.findMany).toHaveBeenCalled();
            expect(result.items).toEqual(${modelName}s);
            expect(result.pagination.totalRecords).toBe(1);
        });
    });
});
