import request from 'supertest';
import app from '../../app';
import i18n from 'i18n';
import prisma from '../../config/prismaClient';
import { performanceTracker } from '../helpers/performanceHelper';

describe('Role Module - Integration Tests', () => {
    let createdRoleId: number;
    let authToken: string;

    beforeAll(async () => {
        i18n.setLocale('en');

        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: process.env.TEST_ADMIN_USERNAME || 'admin@test.com',
                password: process.env.TEST_ADMIN_PASSWORD || '123456',
            });

        authToken = loginResponse.body.result.token;
        console.log('✓ Authentication successful for Role tests');
    });

    afterAll(async () => {
        // Cleanup: delete test data
        if (createdRoleId) {
            await prisma.role
                .delete({
                    where: { id: createdRoleId },
                })
                .catch(() => {
                    // Ignore if already deleted
                });
        }
        await prisma.$disconnect();

        // Display performance summary
        performanceTracker.getSummary();
        performanceTracker.reset();
    });

    describe('POST /api/v1/role - Create Role', () => {
        it('should create a role successfully with valid data', async () => {
            const roleData = {
                name: `Test Role ${Date.now()}`,
                description: 'Integration test role',
                status: '1',
            };

            const response = await performanceTracker.measureApiCall(
                'Create Role',
                () =>
                    request(app)
                        .post('/api/v1/role')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(roleData)
                        .expect(201),
            );

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toMatchObject({
                name: roleData.name,
                description: roleData.description,
            });

            createdRoleId = response.body.result.id;
        });

        it('should fail to create role without authentication', async () => {
            const roleData = {
                name: 'Unauthorized Role',
                description: 'Test role',
            };

            const response = await performanceTracker.measureApiCall(
                'Create Role (Unauthorized)',
                () =>
                    request(app)
                        .post('/api/v1/role')
                        .send(roleData)
                        .expect(401),
            );

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to create role with duplicate name', async () => {
            const roleName = `Duplicate Role ${Date.now()}`;
            const roleData = {
                name: roleName,
                description: 'Duplicate test',
                status: '1',
            };

            // Create first role
            await request(app)
                .post('/api/v1/role')
                .set('Authorization', `Bearer ${authToken}`)
                .send(roleData)
                .expect(201);

            // Try to create duplicate
            const response = await performanceTracker.measureApiCall(
                'Create Role (Duplicate)',
                () =>
                    request(app)
                        .post('/api/v1/role')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(roleData)
                        .expect(400),
            );

            expect(response.body).toHaveProperty('status', 'fail');
        });

        it('should fail to create role with invalid data', async () => {
            const invalidRoleData = {
                name: '',
                description: '',
            };

            const response = await performanceTracker.measureApiCall(
                'Create Role (Invalid Data)',
                () =>
                    request(app)
                        .post('/api/v1/role')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(invalidRoleData)
                        .expect(400),
            );

            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/v1/role - Get All Roles', () => {
        it('should fetch all roles successfully', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get All Roles',
                () =>
                    request(app)
                        .get('/api/v1/role')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
                300, // Expected max time
            );

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
            expect(Array.isArray(response.body.result.data)).toBe(true);
        });

        it('should fetch roles with pagination', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get Roles (Paginated)',
                () =>
                    request(app)
                        .get('/api/v1/role?page=1&limit=5')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toHaveProperty('pagination');
            expect(response.body.result.pagination.currentPage).toBe(1);
            expect(response.body.result.pagination.pageSize).toBe(5);
        });

        it('should fetch roles with filtering', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get Roles (Filtered)',
                () =>
                    request(app)
                        .get('/api/v1/role?name=Test')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
            expect(Array.isArray(response.body.result.data)).toBe(true);
        });

        it('should fetch roles with sorting', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get Roles (Sorted)',
                () =>
                    request(app)
                        .get('/api/v1/role?orderBy=name:desc')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
        });
    });

    describe('GET /api/v1/role/:id - Get Role by ID', () => {
        it('should fetch a role by ID successfully', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get Role by ID',
                () =>
                    request(app)
                        .get(`/api/v1/role/${createdRoleId}`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
            expect(response.body.result.id).toBe(createdRoleId);
        });

        it('should return 404 for non-existent role', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get Role (Not Found)',
                () =>
                    request(app)
                        .get('/api/v1/role/999999')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(404),
            );

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('PUT /api/v1/role/:id - Update Role', () => {
        it('should update a role successfully', async () => {
            const updateData = {
                name: `Updated Role ${Date.now()}`,
                description: 'Updated description',
            };

            const response = await performanceTracker.measureApiCall(
                'Update Role',
                () =>
                    request(app)
                        .put(`/api/v1/role/${createdRoleId}`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(updateData)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
            expect(response.body.result.name).toBe(updateData.name);
            expect(response.body.result.description).toBe(
                updateData.description,
            );
        });

        it('should fail to update non-existent role', async () => {
            const updateData = { name: 'Test Role' };

            const response = await performanceTracker.measureApiCall(
                'Update Role (Not Found)',
                () =>
                    request(app)
                        .put('/api/v1/role/999999')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(updateData)
                        .expect(404),
            );

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('DELETE /api/v1/role/:id - Delete Role', () => {
        it('should delete a role successfully', async () => {
            const response = await performanceTracker.measureApiCall(
                'Delete Role',
                () =>
                    request(app)
                        .delete(`/api/v1/role/${createdRoleId}`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('message');
        });

        it('should return 404 when deleting non-existent role', async () => {
            const response = await performanceTracker.measureApiCall(
                'Delete Role (Not Found)',
                () =>
                    request(app)
                        .delete('/api/v1/role/999999')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(404),
            );

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('Role-Permission Integration', () => {
        it('should create role with permissions', async () => {
            const roleData = {
                name: `Role with Permissions ${Date.now()}`,
                description: 'Test role with permissions',
                status: '1',
            };

            const roleResponse = await request(app)
                .post('/api/v1/role')
                .set('Authorization', `Bearer ${authToken}`)
                .send(roleData)
                .expect(201);

            const roleId = roleResponse.body.result.id;

            // Verify role was created
            const getResponse = await request(app)
                .get(`/api/v1/role/${roleId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(getResponse.body.result).toMatchObject(roleData);

            // Cleanup
            await prisma.role.delete({ where: { id: roleId } }).catch(() => {});
        });
    });

    describe('Performance & Stress Tests', () => {
        it('should handle concurrent role creation requests', async () => {
            const requests = Array(3)
                .fill(null)
                .map((_, index) =>
                    request(app)
                        .post('/api/v1/role')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send({
                            name: `Concurrent Role ${index} ${Date.now()}`,
                            description: `Test concurrent role ${index}`,
                            status: '1',
                        }),
                );

            const responses = await Promise.all(requests);

            responses.forEach((response) => {
                expect(response.status).toBe(201);
            });

            // Cleanup
            for (const response of responses) {
                if (response.body.result?.id) {
                    await prisma.role
                        .delete({
                            where: { id: response.body.result.id },
                        })
                        .catch(() => {});
                }
            }
        });
    });
});
