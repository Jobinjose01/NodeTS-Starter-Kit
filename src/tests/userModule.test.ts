import request from 'supertest';
import app from '../app';
import i18n from 'i18n';

describe('User Registration', () => {
    beforeAll(() => {
        i18n.setLocale('en');
    });

    it('should register a user successfully', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            username: `john.doe_${Math.floor(Math.random() * 10000)}@example.com`,
            phone: '1234567890',
            password: 'password123',
        };

        const response = await request(app)
            .post('/api/v1/user/register')
            .send(userData)
            .expect(201);

        expect(response.body).toMatchObject({
            message: i18n.__('user.USER_CREATED_SUCCESSFULLY'),
            result: expect.objectContaining({
                firstName: 'John',
            }),
        });
    });
});

describe('User Registration', () => {
    it('should fail to register a user with an existing username', async () => {
        const userData = {
            firstName: 'John',
            lastName: 'Doe',
            username: `john.doe_${Math.floor(Math.random() * 10000)}@example.com`,
            phone: '1234567890',
            password: 'password123',
        };

        await request(app)
            .post('/api/v1/user/register')
            .send(userData)
            .expect(201);

        const response = await request(app)
            .post('/api/v1/user/register')
            .send(userData)
            .expect(400);

        expect(response.body).toMatchObject({
            status: 'fail',
            errors: [
                {
                    field: 'username',
                    message: i18n.__('user.USERNAME_ALREADY_TAKEN'),
                    location: 'body',
                },
            ],
        });
    });
});

describe('User Get By ID', () => {
    it('should fetch a user successfully', async () => {
        const response = await request(app).get('/api/v1/user/6').expect(200);

        expect(response.body).toMatchObject({
            message: i18n.__('user.USER_FETCHED'),
            result: expect.objectContaining({
                id: 6,
            }),
        });
    });
});
describe('User Get By ID', () => {
    it('Failed User fetch ', async () => {
        const response = await request(app).get('/api/v1/user/600').expect(404);

        expect(response.body).toMatchObject({
            message: i18n.__('user.USER_NOT_FOUND'),
        });
    });
});

describe('User Update', () => {
    it('Update User record ', async () => {
        const userData = {
            firstName: 'Jobin',
            lastName: 'Jose',
            username: 'jobin6@gmail.com',
            phone: '1234567890',
            password: 'password123',
        };

        const response = await request(app)
            .put('/api/v1/user/6')
            .send(userData)
            .expect(200);

        expect(response.body).toMatchObject({
            message: i18n.__('user.USER_UPDATED_SUCCESSFULLY'),
            result: expect.objectContaining({
                firstName: 'Jobin',
            }),
        });
    });

    it('Failed User Update ', async () => {
        const userData = {
            firstName: 'Jobin',
            lastName: 'Jose',
            username: 'jobin600@gmail.com',
            phone: '1234567890',
            password: 'password123',
        };

        const response = await request(app)
            .put('/api/v1/user/600')
            .send(userData)
            .expect(404);

        expect(response.body).toMatchObject({
            message: i18n.__('user.USER_NOT_FOUND'),
        });
    });
});
