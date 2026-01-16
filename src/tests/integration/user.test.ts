import request from 'supertest';
import app from '../../app';
import i18n from 'i18n';
import prisma from '../../config/prismaClient';
import { performanceTracker } from '../helpers/performanceHelper';
import { getAuthToken } from './setup';

describe('User Module - Integration Tests', () => {
    let createdUserId: number;
    let authToken: string;

    beforeAll(async () => {
        i18n.setLocale('en');

        // Get shared auth token
        authToken = await getAuthToken();
    });

    afterAll(async () => {
        // Cleanup: delete test data
        if (createdUserId) {
            await prisma.user
                .delete({
                    where: { id: createdUserId },
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

    describe('POST /api/v1/user - Create User', () => {
        it('should create a user successfully with valid data', async () => {
            const userData = {
                firstName: 'Integration',
                lastName: 'Test',
                username: `integration.test_${Date.now()}@example.com`,
                phone: '9876543210',
                password: 'TestPass123!',
                roleId: '2',
                status: '1',
            };

            const response = await performanceTracker.measureApiCall(
                'Create User',
                () =>
                    request(app)
                        .post('/api/v1/user')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(userData),
            );

            if (response.status !== 201) {
                console.error(
                    'Create user failed:',
                    response.status,
                    response.body,
                );
            }
            expect(response.status).toBe(201);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toMatchObject({
                firstName: 'Integration',
                lastName: 'Test',
                username: userData.username,
            });

            createdUserId = response.body.result.id;
        });

        it('should fail to create user without authentication', async () => {
            const userData = {
                firstName: 'Test',
                lastName: 'User',
                username: `test_${Date.now()}@example.com`,
                password: 'password123',
            };

            const response = await performanceTracker.measureApiCall(
                'Create User (Unauthorized)',
                () =>
                    request(app)
                        .post('/api/v1/user')
                        .send(userData)
                        .expect(401),
            );

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to create user with duplicate username', async () => {
            const userData = {
                firstName: 'Duplicate',
                lastName: 'Test',
                username: `duplicate_${Date.now()}@example.com`,
                phone: '1111111111',
                password: 'password123',
                roleId: '2',
                status: '1',
            };

            // Create first user
            await request(app)
                .post('/api/v1/user')
                .set('Authorization', `Bearer ${authToken}`)
                .send(userData)
                .expect(201);

            // Try to create duplicate
            const response = await performanceTracker.measureApiCall(
                'Create User (Duplicate)',
                () =>
                    request(app)
                        .post('/api/v1/user')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(userData)
                        .expect(400),
            );

            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('errors');
        });

        it('should fail to create user with invalid data', async () => {
            const invalidUserData = {
                firstName: '',
                lastName: '',
                username: 'not-an-email',
                password: '123',
            };

            const response = await performanceTracker.measureApiCall(
                'Create User (Invalid Data)',
                () =>
                    request(app)
                        .post('/api/v1/user')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(invalidUserData)
                        .expect(400),
            );

            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/v1/user - Get All Users', () => {
        it('should fetch all users successfully', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get All Users',
                () =>
                    request(app)
                        .get('/api/v1/user')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
                500, // Expected max time
            );

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toHaveProperty('items');
            expect(Array.isArray(response.body.result.items)).toBe(true);
        });

        it('should fetch users with pagination', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get Users (Paginated)',
                () =>
                    request(app)
                        .get('/api/v1/user?page=1&limit=5')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toHaveProperty('pagination');
            expect(response.body.result.pagination.currentPage).toBe(1);
            expect(response.body.result.pagination.recordsPerPage).toBe(5);
        });

        it('should fetch users with filtering', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get Users (Filtered)',
                () =>
                    request(app)
                        .get('/api/v1/user?firstName=Integration')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toHaveProperty('items');
            expect(Array.isArray(response.body.result.items)).toBe(true);
        });

        it('should fetch users with sorting', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get Users (Sorted)',
                () =>
                    request(app)
                        .get('/api/v1/user?orderBy=firstName:asc')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
        });
    });

    describe('GET /api/v1/user/:id - Get User by ID', () => {
        it('should fetch a user by ID successfully', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get User by ID',
                () =>
                    request(app)
                        .get(`/api/v1/user/${createdUserId}`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('result');
            expect(response.body.result.id).toBe(createdUserId);
        });

        it('should return 404 for non-existent user', async () => {
            const response = await performanceTracker.measureApiCall(
                'Get User (Not Found)',
                () =>
                    request(app)
                        .get('/api/v1/user/999999')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(404),
            );

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('PUT /api/v1/user/:id - Update User', () => {
        it('should update a user successfully', async () => {
            const updateData = {
                firstName: 'Updated',
                lastName: 'Name',
            };

            const response = await performanceTracker.measureApiCall(
                'Update User',
                () =>
                    request(app)
                        .put(`/api/v1/user/${createdUserId}`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(updateData),
            );

            if (response.status !== 200) {
                console.error(
                    'Update user failed:',
                    response.status,
                    response.body,
                );
            }
            expect(response.status).toBe(200);

            expect(response.body).toHaveProperty('result');
            expect(response.body.result.firstName).toBe('Updated');
            expect(response.body.result.lastName).toBe('Name');
        });

        it('should fail to update non-existent user', async () => {
            const updateData = { firstName: 'Test' };

            const response = await performanceTracker.measureApiCall(
                'Update User (Not Found)',
                () =>
                    request(app)
                        .put('/api/v1/user/999999')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send(updateData)
                        .expect(404),
            );

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('DELETE /api/v1/user/:id - Delete User', () => {
        it('should delete a user successfully', async () => {
            const response = await performanceTracker.measureApiCall(
                'Delete User',
                () =>
                    request(app)
                        .delete(`/api/v1/user/${createdUserId}`)
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(200),
            );

            expect(response.body).toHaveProperty('message');
        });

        it('should return 404 when deleting non-existent user', async () => {
            const response = await performanceTracker.measureApiCall(
                'Delete User (Not Found)',
                () =>
                    request(app)
                        .delete('/api/v1/user/999999')
                        .set('Authorization', `Bearer ${authToken}`)
                        .expect(404),
            );

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('Performance & Stress Tests', () => {
        it('should handle concurrent user creation requests', async () => {
            const requests = Array(3)
                .fill(null)
                .map((_, index) =>
                    request(app)
                        .post('/api/v1/user')
                        .set('Authorization', `Bearer ${authToken}`)
                        .send({
                            firstName: `Concurrent${index}`,
                            lastName: 'Test',
                            username: `concurrent${index}_${Date.now()}@example.com`,
                            phone: `${1000000000 + index}`,
                            password: 'password123',
                            roleId: '2',
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
                    await prisma.user
                        .delete({
                            where: { id: response.body.result.id },
                        })
                        .catch(() => {});
                }
            }
        });
    });
});
