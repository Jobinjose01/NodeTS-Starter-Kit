import request from 'supertest';
import app from '../../app';
import i18n from 'i18n';
import prisma from '../../config/prismaClient';

describe('${ModelName} Module', () => {
    let created${ModelName}Id: number;
    let authToken: string;

    beforeEach(async () => {
        i18n.setLocale('en');
        
        // Login to get auth token
        const loginResponse = await request(app)
            .post('/api/v1/auth/login')
            .send({
                username: process.env.TEST_ADMIN_USERNAME || 'admin@test.com',
                password: process.env.TEST_ADMIN_PASSWORD || '123456',
            });
        
        authToken = loginResponse.body.result.token;
        console.log('✓ Authentication successful');
    });

    afterAll(async () => {
        // Cleanup: delete test data if needed
        if (created${ModelName}Id) {
            await prisma.${modelName}.delete({
                where: { id: created${ModelName}Id },
            }).catch(() => {
                // Ignore if already deleted
            });
        }
        await prisma.$disconnect();
    });

    describe('POST /api/v1/${pluralModelName} - Create ${ModelName}', () => {
        it('should create a ${modelName} successfully with valid data', async () => {
            const ${modelName}Data = {
                ${testCreateData}
            };

            const response = await request(app)
                .post('/api/v1/${pluralModelName}')
                .set('Authorization', `Bearer \${authToken}`)
                .send(${modelName}Data)
                .expect(201);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toMatchObject({
                ${testCreateExpectation}
            });

            created${ModelName}Id = response.body.result.id;
        });

        it('should fail to create ${modelName} without authentication', async () => {
            const ${modelName}Data = {
                ${testCreateData}
            };

            const response = await request(app)
                .post('/api/v1/${pluralModelName}')
                .send(${modelName}Data)
                .expect(401);

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to create ${modelName} with missing required fields', async () => {
            const incomplete${ModelName}Data = {};

            const response = await request(app)
                .post('/api/v1/${pluralModelName}')
                .set('Authorization', `Bearer \${authToken}`)
                .send(incomplete${ModelName}Data)
                .expect(400);

            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('errors');
            expect(Array.isArray(response.body.errors)).toBe(true);
        });

        it('should fail to create ${modelName} with invalid data types', async () => {
            const invalid${ModelName}Data = {
                ${testInvalidData}
            };

            const response = await request(app)
                .post('/api/v1/${pluralModelName}')
                .set('Authorization', `Bearer \${authToken}`)
                .send(invalid${ModelName}Data)
                .expect(400);

            expect(response.body).toHaveProperty('status', 'fail');
            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/v1/${pluralModelName} - Get All ${ModelName}s', () => {
        it('should fetch all ${modelName}s successfully', async () => {
            const response = await request(app)
                .get('/api/v1/${pluralModelName}')
                .set('Authorization', `Bearer \${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
            expect(Array.isArray(response.body.result)).toBe(true);
        });

        it('should fetch ${modelName}s with pagination', async () => {
            const response = await request(app)
                .get('/api/v1/${pluralModelName}?page=1&limit=10')
                .set('Authorization', `Bearer \${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('result');
            expect(response.body).toHaveProperty('pagination');
            expect(response.body.pagination).toMatchObject({
                currentPage: 1,
                recordsPerPage: 10,
            });
        });

        it('should fetch ${modelName}s with filtering', async () => {
            const response = await request(app)
                .get('/api/v1/${pluralModelName}?${testFilterParam}')
                .set('Authorization', `Bearer \${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('result');
            expect(Array.isArray(response.body.result)).toBe(true);
        });

        it('should fetch ${modelName}s with sorting', async () => {
            const response = await request(app)
                .get('/api/v1/${pluralModelName}?orderBy=id:desc')
                .set('Authorization', `Bearer \${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('result');
            expect(Array.isArray(response.body.result)).toBe(true);
        });

        it('should fail to fetch ${modelName}s without authentication', async () => {
            const response = await request(app)
                .get('/api/v1/${pluralModelName}')
                .expect(401);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('GET /api/v1/${pluralModelName}/:id - Get ${ModelName} by ID', () => {
        it('should fetch a ${modelName} by ID successfully', async () => {
            const response = await request(app)
                .get(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .set('Authorization', `Bearer \${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toMatchObject({
                id: created${ModelName}Id,
            });
        });

        it('should fail to fetch ${modelName} with non-existent ID', async () => {
            const nonExistentId = 999999;
            const response = await request(app)
                .get(`/api/v1/${pluralModelName}/\${nonExistentId}`)
                .set('Authorization', `Bearer \${authToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to fetch ${modelName} with invalid ID format', async () => {
            const response = await request(app)
                .get('/api/v1/${pluralModelName}/invalid-id')
                .set('Authorization', `Bearer \${authToken}`)
                .expect(400);

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to fetch ${modelName} without authentication', async () => {
            const response = await request(app)
                .get(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .expect(401);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('PUT /api/v1/${pluralModelName}/:id - Update ${ModelName}', () => {
        it('should update a ${modelName} successfully', async () => {
            const updated${ModelName}Data = {
                ${testUpdateData}
            };

            const response = await request(app)
                .put(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .set('Authorization', `Bearer \${authToken}`)
                .send(updated${ModelName}Data)
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
            expect(response.body.result).toMatchObject({
                id: created${ModelName}Id,
                ${testUpdateExpectation}
            });
        });

        it('should update ${modelName} with partial data', async () => {
            const partial${ModelName}Data = {
                ${testPartialUpdateData}
            };

            const response = await request(app)
                .put(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .set('Authorization', `Bearer \${authToken}`)
                .send(partial${ModelName}Data)
                .expect(200);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('result');
        });

        it('should fail to update ${modelName} with non-existent ID', async () => {
            const nonExistentId = 999999;
            const updated${ModelName}Data = {
                ${testUpdateData}
            };

            const response = await request(app)
                .put(`/api/v1/${pluralModelName}/\${nonExistentId}`)
                .set('Authorization', `Bearer \${authToken}`)
                .send(updated${ModelName}Data)
                .expect(404);

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to update ${modelName} with invalid data', async () => {
            const invalid${ModelName}Data = {
                ${testInvalidData}
            };

            const response = await request(app)
                .put(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .set('Authorization', `Bearer \${authToken}`)
                .send(invalid${ModelName}Data)
                .expect(400);

            expect(response.body).toHaveProperty('status', 'fail');
        });

        it('should fail to update ${modelName} without authentication', async () => {
            const updated${ModelName}Data = {
                ${testUpdateData}
            };

            const response = await request(app)
                .put(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .send(updated${ModelName}Data)
                .expect(401);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('DELETE /api/v1/${pluralModelName}/:id - Delete ${ModelName}', () => {
        it('should delete a ${modelName} successfully', async () => {
            const response = await request(app)
                .delete(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .set('Authorization', `Bearer \${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to delete ${modelName} with non-existent ID', async () => {
            const nonExistentId = 999999;
            const response = await request(app)
                .delete(`/api/v1/${pluralModelName}/\${nonExistentId}`)
                .set('Authorization', `Bearer \${authToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to delete ${modelName} without authentication', async () => {
            const response = await request(app)
                .delete(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .expect(401);

            expect(response.body).toHaveProperty('message');
        });

        it('should fail to delete already deleted ${modelName}', async () => {
            const response = await request(app)
                .delete(`/api/v1/${pluralModelName}/\${created${ModelName}Id}`)
                .set('Authorization', `Bearer \${authToken}`)
                .expect(404);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('Edge Cases and Security', () => {
        it('should handle SQL injection attempts safely', async () => {
            const malicious${ModelName}Data = {
                name: "'; DROP TABLE ${modelName}s; --",
            };

            const response = await request(app)
                .post('/api/v1/${pluralModelName}')
                .set('Authorization', `Bearer \${authToken}`)
                .send(malicious${ModelName}Data);

            // Should either create safely or reject, but not cause server error
            expect([201, 400]).toContain(response.status);
        });

        it('should handle XSS attempts in ${modelName} data', async () => {
            const xss${ModelName}Data = {
                name: '<script>alert("XSS")</script>',
            };

            const response = await request(app)
                .post('/api/v1/${pluralModelName}')
                .set('Authorization', `Bearer \${authToken}`)
                .send(xss${ModelName}Data);

            if (response.status === 201) {
                expect(response.body.result.name).not.toContain('<script>');
            }
        });

        it('should handle very long input strings', async () => {
            const long${ModelName}Data = {
                name: 'a'.repeat(1000),
            };

            const response = await request(app)
                .post('/api/v1/${pluralModelName}')
                .set('Authorization', `Bearer \${authToken}`)
                .send(long${ModelName}Data);

            expect([201, 400]).toContain(response.status);
        });

        it('should handle concurrent requests properly', async () => {
            const ${modelName}Data = {
                ${testCreateData}
            };

            const requests = Array(5).fill(null).map(() =>
                request(app)
                    .post('/api/v1/${pluralModelName}')
                    .set('Authorization', `Bearer \${authToken}`)
                    .send(${modelName}Data)
            );

            const responses = await Promise.all(requests);
            
            responses.forEach(response => {
                expect([201, 400, 409]).toContain(response.status);
            });

            // Cleanup
            for (const response of responses) {
                if (response.status === 201 && response.body.result?.id) {
                    await prisma.${modelName}.delete({
                        where: { id: response.body.result.id },
                    }).catch(() => {});
                }
            }
        });
    });

    describe('Performance Tests', () => {
        it('should respond to GET all request within acceptable time', async () => {
            const startTime = Date.now();
            
            await request(app)
                .get('/api/v1/${pluralModelName}')
                .set('Authorization', `Bearer \${authToken}`)
                .expect(200);
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
        });

        it('should handle pagination efficiently', async () => {
            const response = await request(app)
                .get('/api/v1/${pluralModelName}?page=1&limit=100')
                .set('Authorization', `Bearer \${authToken}`)
                .expect(200);

            expect(response.body.result.length).toBeLessThanOrEqual(100);
        });
    });
});
