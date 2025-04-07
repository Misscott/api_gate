/*import test from 'node:test'
import request from 'supertest'
import assert from 'node:assert/strict'
import { app } from '../src/index.js';

test('GET /users should return a list of users with status 200', async () => {
    return request(app)
    .get('/users')
    .expect(response.status).toBe(200)
    .then(res => {
        assert.ok(res)
    })
    .catch(err => {
        assert.fail(err.message);
    })
    .finally(() => {
        server.close();
    })
});

test('GET /users should return 403 if unauthorized', async () => {
    return request(app)
    .get('/users')
    .expect(403)
    .then(res => {
        assert.ok(res)
    })
    .catch(err => {
        assert.fail(err.message);
    })
    .finally(() => {
        server.close();
    })
});

test('GET /users/:uuid should return a user with status 200', async () => {
    return request(app)
    .get('/users/123e4567-e89b-12d3-a456-426614174000')
    .expect(response.status).toBe(200)
    .expect(response.body).toBeDefined()
});

test('GET /users/:uuid should return 404 if user not found', async () => {
    return request(app)
    .get('/users/nonexistent-uuid')
    .expect(response.status).toBe(404)
});

test('POST /users should create a user and return status 201', async () => {
    return request(app)
        .post('/users')
        .send({ username: 'testuser', password: 'password123', email: 'test@example.com', fk_role: 'role-id' })
    .expect(response.status).toBe(201)
    .expect(response.body).toBeDefined()
});

test('POST /users should return 400 for invalid input', async () => {
    return request(app).post('/users')
    .send({})
    .expect(response.status).toBe(400)
})

test('PUT /users/:uuid should update a user and return status 200', async () => {
    return request(app)
        .put('/users/123e4567-e89b-12d3-a456-426614174000')
        .send({ username: 'updateduser', email: 'updated@example.com' })
        .expect(response.status).toBe(200)
        .expect(response.body).toBeDefined()
});

test('PUT /users/:uuid should return 404 if user not found', async () => {
    return request(app)
        .put('/users/nonexistent-uuid')
        .send({ username: 'updateduser' })
        .expect(response.status).toBe(404)
});

test('DELETE /users/:uuid should delete a user and return status 204', async () => {
    return request(app)
    .delete('/users/123e4567-e89b-12d3-a456-426614174000')
    .expect(response.status).toBe(204)
})

test('DELETE /users/:uuid should return 404 if user not found', async () => {
    return request(app)
    .delete('/users/nonexistent-uuid')
    .expect(response.status).toBe(404)
})
*/