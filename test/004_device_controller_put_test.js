import test from 'node:test'
import request from 'supertest'
import assert from 'node:assert/strict'
import {app, server} from '../src/index.js'


test('-------- Devices Controller: PUT /devices/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 201 for created';
    const expectedCode = 201;
    const deviceUUID = 'f0764ad5-357a-4080-bb4e-b8b3277a41ba'; 
    const serial_number_update_message = 'Device serial number should be updated'
    const model_update_message = 'Device model should be updated'

    const updatedDevice = {
        "serial_number": 'Updated serial number22x',
        "model": 'Model Zfx'
    };

    return request(app)
        .put(`/devices/${deviceUUID}`)
        .send(updatedDevice)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res.body._data.devices[0].serial_number, updatedDevice.serial_number, serial_number_update_message);
            assert.equal(res.body._data.devices[0].model, updatedDevice.model, model_update_message);
        })
        .catch(err => {
            assert.fail(err.message);
        });
});