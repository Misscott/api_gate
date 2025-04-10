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

test('-------- Users Has Devices Controller: GET /users_has_devices', () => {
  const expectedCode = 200;

    return request(app)
        .get('/users_has_devices')
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

test('-------- Users Has Devices Controller: GET /users_has_devices/:uuid', () => {
    const expectedCode = 200;
    const userDeviceUuid = '92691396-0ed5-11f0-8154-bce92f8462b5'; 
  
    return request(app)
        .get(`/users_has_devices/${userDeviceUuid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res)
            console.log(res)
            const {uuid, ...rest} = res._body._data.users_has_devices[0]; //remove uuid from result body
            assert.deepStrictEqual(rest, {
                device_uuid: '927a6280-0ed5-11f0-8154-bce92f8462b5',
                fk_device: 2,
                fk_user: 3,
                serial_number: 'SN00HOLI',
                stock: 3,
                user_uuid: '00f6f64a-0ee1-11f0-8154-bce92f8462b5',
                username: 'admin_user'
            })
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
});

test('-------- Users Has Devices Controller: GET /users_has_devices/:uuid unprocessable entity', () => {
    const expectedCode = 422;
    const userDeviceUuid = 'diagjpawhpg'; 

    return request(app)
        .get(`/users_has_devices/${userDeviceUuid}`)
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

/*test('-------- Users Has Devices Controller: GET /users_has_devices/:uuid not found (deleted)', () => {
    const messageForExpectedCode = 'Status code must be 404 for not found';
    const expectedCode = 404;
    const userDeviceUuid = '9a4ca537-4a36-4ac8-886e-bc25581ac705'; 
  
    return request(app)
        .get(`/users_has_devices/${userDeviceUuid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res);
            assert.equal(res.body.code, expectedCode, messageForExpectedCode);
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
});*/