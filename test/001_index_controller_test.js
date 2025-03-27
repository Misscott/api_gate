import test from 'node:test'
import request from 'supertest'
import assert from 'node:assert/strict'
import {app, server} from '../src/index.js'

test('-------- Controller: GET /', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const messageForExpectedBody = `Message must be 'Server up!'`;
    const expectedCode           = 200;
    const expectedBody           = "Server up!";

    return request(app)
        .get('/')
        .expect(expectedCode)
        .then(res => {
            assert.ok(res);
            assert.deepEqual(res.body._data.message, expectedBody, messageForExpectedBody);
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
    ;
});