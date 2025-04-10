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

test('-------- users_has_devices Controller: POST /users_has_devices', () => {
    const expectedCode = 201;
    const fk_user_id = 19; //user id
    const fk_device_id = 8; //device id

    const data = {
        "fk_user": "736b0f45-c5dc-41c4-805a-6258bd37b57b",
        "fk_device": "f39c28c6-1f6f-4947-b784-15622f4e90d3",
        "stock": 3
    };
    const dataAssert = {
        fk_user: fk_user_id,
        fk_device: fk_device_id,
        stock: 3
    };

    return request(app)
        .post('/users_has_devices')
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            const {uuid, ...rest} = res._body._data.users_has_devices[0] //remove uuid from result body
            assert.deepStrictEqual(rest, dataAssert);
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});

test('-------- users_has_devices Controller: POST /users_has_devices', () => {
    const messageForExpectedCode = 'Status code must be 400 for bad request';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode = 400;

    const data = {};

    return request(app)
        .post('/users_has_devices')
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

test('-------- users_has_devices Controller: POST /users_has_devices unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;

    const updatedEntity = {
        "fk_user" : "aksjdkg",
        "fk_device" : "aksjdkg",
        "stock" : "aksjdkg"
    };//good syntax but wrong data types

    return request(app)
        .post(`/users_has_devices`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedEntity)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res.body.code, expectedCode, messageForExpectedCode);
        })
        .catch(err => {
            assert.fail(err.message);
        });
})

test('-------- users_has_devices Controller: PUT /users_has_devices/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 201 for created';
    const expectedCode = 201;
    const userHasDeviceUuid = '9cc423a6-ade8-4a9a-ba09-913deabfd8da'; 
    const update_message = 'Should be updated'

    const updatedEntity = {
        "stock": 2
    };

    return request(app)
        .put(`/users_has_devices/${userHasDeviceUuid}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedEntity)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res._body._data.users_has_devices[0].stock, updatedEntity.stock, update_message);
        })
        .catch(err => {
            assert.fail(err.message);
        });
});

test('-------- users_has_devices Controller: PUT /users_has_devices/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;
    const userHasDeviceUuid = 'sdgarga'; 

    const updatedEntity = {
        "stock" : 3
    };

    return request(app)
        .put(`/users_has_devices/${userHasDeviceUuid}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedEntity)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res.body.code, expectedCode, messageForExpectedCode);
        })
        .catch(err => {
            assert.fail(err.message);
        });
});

test('-------- users_has_devices Controller: DELETE /users_has_devices/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;
    const userHasDeviceUuid = '9e8841de-2d33-49cb-a456-ed2a4a2e329a'

    return request(app)
        .get(`/users_has_devices/${userHasDeviceUuid}`)
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

test('-------- users_has_devices Controller: DELETE /users_has_devices/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const expectedCode           = 422;
    const userHasDeviceUuid = 'fdhsdh'

    return request(app)
        .get(`/users_has_devices/${userHasDeviceUuid}`)
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

/*test('-------- Endpoints Controller: DELETE /users_has_devices/:uuid not found', () => {
    const messageForExpectedCode = 'Status code must be 404';
    const expectedCode           = 404;
    const userHasDeviceUuid = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/users_has_devices/${userHasDeviceUuid}`)
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
});*/
