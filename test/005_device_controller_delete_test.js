import test from 'node:test'
import request from 'supertest'
import assert from 'node:assert/strict'
import {app, server} from '../src/index.js'

let userToken;

test('Setup - Get authentication token', () => {
    return request(app)
        .post('/login')
        .send({
            username: 'admin_user',
            password: 'admin_password'
        })
        .expect(201)
        .then(response => {
            assert.ok(response.body.user.accessToken, 'Token should be present in the response body');
            userToken = response.body.user.accessToken; 
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        });
});

test('-------- Devices Controller: DELETE /devices/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;
    const deviceUUID = 'a3fc3a0b-4726-4c1f-b317-cb8c8801037d'

    return request(app)
        .get(`/devices/${deviceUUID}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .expect(expectedCode)
        .then(res => {
            assert.ok(res);
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
    ;
});

test('-------- Devices Controller: DELETE /devices/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const expectedCode           = 422;
    const deviceUUID = 'fdhsdh'

    return request(app)
        .get(`/devices/${deviceUUID}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .expect(expectedCode)
        .then(res => {
            assert.ok(res);
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
    ;
});

test('-------- Devices Controller: DELETE /devices/:uuid not found', () => {
    const messageForExpectedCode = 'Status code must be 404';
    const expectedCode           = 404;
    const deviceUUID = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/devices/${deviceUUID}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .expect(expectedCode)
        .then(res => {
            assert.ok(res);
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
    ;
});