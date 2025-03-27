import test from 'node:test'
import request from 'supertest'
import assert from 'node:assert/strict'
import {app, server} from '../src/index.js'

test('-------- Devices Controller: POST /devices', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode = 200;

    const data = {
        "serial_number": "SN123456789",
        "model": "Model X",
        "brand": "Brand Y",
        "description": "A description of the device.",
        "stock": 10
    };

    return request(app)
        .post('/devices')
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            const {uuid, ...rest} = res.body._data[0] //remove uuid from result body
            assert.deepStrictEqual(rest, data);
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});

test('-------- Devices Controller: POST /devices', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode = 422;

    const data = {};

    return request(app)
        .post('/devices')
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            const {uuid, ...rest} = res.body._data[0] //remove uuid from result body
            assert.deepStrictEqual(rest, data);
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});