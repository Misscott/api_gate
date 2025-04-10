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

test('-------- Devices Controller: POST /devices', () => {
    const expectedCode = 200;

    const data = {
        "serial_number": "SN123456789",
        "model": "Model X",
        "brand": "Brand Y",
        "description": "A description of the device."
    };

    return request(app)
        .post('/devices')
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            const {uuid, ...rest} = res._body._data[0] //remove uuid from result body
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
    const messageForExpectedCode = 'Status code must be 400 for bad request';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode = 400;

    const data = {};

    return request(app)
        .post('/devices')
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            assert.equal(res.body.code, expectedCode, messageForExpectedCode);
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});

test('-------- Devices Controller: POST /devices unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;

    const updatedDevice = {
        "serial_number": 5,
        "model": 1,
        "brand": 2
    };//good syntax but wrong data types

    return request(app)
        .post(`/devices`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedDevice)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res.body.code, expectedCode, messageForExpectedCode);
        })
        .catch(err => {
            assert.fail(err.message);
        });
})