import test from 'node:test'
import request from 'supertest'
import assert from 'node:assert/strict'
import {app, server} from '../src/index.js'


test('-------- Devices Controller: GET /devices', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;

    return request(app)
        .get('/devices')
        .expect(expectedCode)
        .expect('Content-Type', 'application/json; charset=utf-8')
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

test('-------- Devices Controller: GET /devices/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode           = 200;

    return request(app)
        .get('/devices/f0764ad5-357a-4080-bb4e-b8b3277a41ba')
        .expect(expectedCode)
        .expect('Content-Type', 'application/json; charset=utf-8')
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

test('-------- Devices Controller: GET /devices/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const expectedCode           = 422;

    return request(app)
        .get('/devices/diagjpawhpg')
        .expect(expectedCode)
        .then(res => {
            assert.ok(res)
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
    ;
});

