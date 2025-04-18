import test from 'node:test';
import request from 'supertest';
import assert from 'node:assert/strict';
import {app, server} from '../src/index.js';

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

test('-------- Devices Controller: GET /devices', () => {
  const expectedCode = 200;

    return request(app)
        .get('/devices')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then( res=> {
            assert.ok(res);
        })
        .catch((err) => {
            assert.fail(err.message);
        })
        .finally(() => {
             server.close();
        })
});

test('-------- Devices Controller: GET /devices/:uuid', () => {
    const expectedCode = 200;
    const deviceUuid = '927a6280-0ed5-11f0-8154-bce92f8462b5'; 
  
    return request(app)
        .get(`/devices/${deviceUuid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res);
            const {uuid, ...rest} = res._body._data.device[0]; //remove uuid from result body
            assert.deepStrictEqual(rest, {
                serial_number: 'SN00HOLI',
                model: 'Smartphone Shey',
                brand: 'MobileTechno',
                description: 'Latest smartphone model'
            })
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
});

test('-------- Devices Controller: GET /devices/:uuid unprocessable entity', () => {
    const expectedCode = 422;
    const deviceUUID = 'diagjpawhpg'; 

    return request(app)
        .get(`/devices/${deviceUUID}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
          assert.equal(res.body.code, 422, 'Status code must be 422 for unprocessable entity');
        })
        .catch (err => {
          assert.fail(err.message);
        })
        .finally(() => {
          server.close();
        });
});