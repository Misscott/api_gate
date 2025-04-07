import test from 'node:test'
import request from 'supertest'
import assert from 'node:assert/strict'
import {app, server} from '../src/index.js'


test('-------- Devices Controller: DELETE /devices/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;
    const deviceUUID = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/devices/${deviceUUID}`)
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
    const deviceUUID = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/devices/${deviceUUID}`)
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