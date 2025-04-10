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

test('-------- Devices Controller: PUT /devices/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 201 for created';
    const expectedCode = 201;
    const deviceUUID = 'a3fc3a0b-4726-4c1f-b317-cb8c8801037d'; 
    const serial_number_update_message = 'Device serial number should be updated'
    const model_update_message = 'Device model should be updated'

    const updatedDevice = {
        "serial_number": 'Updated serial number22x',
        "model": 'Model Zfx'
    };

    return request(app)
        .put(`/devices/${deviceUUID}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedDevice)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res._body._data.devices[0].serial_number, updatedDevice.serial_number, serial_number_update_message);
            assert.equal(res._body._data.devices[0].model, updatedDevice.model, model_update_message);
        })
        .catch(err => {
            assert.fail(err.message);
        });
});

test('-------- Devices Controller: PUT /devices/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;
    const deviceUUID = 'sdgarga'; 

    const updatedDevice = {
        "serial_number": 'Updated serial number22x',
        "model": 'Model Zfx'
    };

    return request(app)
        .put(`/devices/${deviceUUID}`)
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
});

test('-------- Devices Controller: PUT /devices/:uuid not found', () => {
    const messageForExpectedCode = 'Status code must be 404 for not found';
    const expectedCode = 404;
    const deviceUUID = 'a3fc3a0b-4726-4c1f-b317-cb8c8801037e'; 

    const updatedDevice = {
        "serial_number": 'Updated serial number22x',
        "model": 'Model Zfx'
    };

    return request(app)
        .put(`/devices/${deviceUUID}`)
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
});