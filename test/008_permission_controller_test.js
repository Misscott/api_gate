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

test('-------- Permissions Controller: GET /permissions', () => {
  const expectedCode = 200;

    return request(app)
        .get('/permissions')
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

test('-------- Permissions Controller: GET /permissions/:uuid', () => {
    const expectedCode = 200;
    const permissionUuid = '3b8ef98c-0f97-11f0-8cdf-bce92f8462b5'; 
  
    return request(app)
        .get(`/permissions/${permissionUuid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res)
            const {uuid, ...rest} = res._body._data.permissions[0]; //remove uuid from result body
            assert.deepStrictEqual(rest, {
                action: 'GET',
                route: '/',
                fk_endpoint: 1
            })
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
});

test('-------- Permissions Controller: GET /permissions/:uuid unprocessable entity', () => {
    const expectedCode = 422;
    const permissionUuid = 'diagjpawhpg'; 

    return request(app)
        .get(`/permissions/${permissionUuid}`)
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

/*test('-------- Permissions Controller: GET /permissions/:uuid not found (deleted permission)', () => {
    const messageForExpectedCode = 'Status code must be 404 for not found';
    const expectedCode = 404;
    const permissionUuid = '4c7ef98c-0f97-11f0-8cdf-dff92f8462c8'; 
  
    return request(app)
        .get(`/permissions/${permissionUuid}`)
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

test('-------- Permissions Controller: POST /permissions', () => {
    const expectedCode = 201;

    const data = {
        "action": "GET",
        "endpoint": "/testpost"
    };

    return request(app)
        .post('/permissions')
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            const {uuid, ...rest} = res._body._data.permissions[0] //remove uuid from result body
            assert.deepStrictEqual(rest, data);
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});

test('-------- Permissions Controller: POST /permissions bad request', () => {
    const messageForExpectedCode = 'Status code must be 400 for bad request';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode = 400;

    const data = {};

    return request(app)
        .post('/permissions')
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

test('-------- Permissions Controller: POST /permissions unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;

    const updatedEntity = {
        "action" : 1,
        "endpoint": 1
    };//good syntax but wrong data types

    return request(app)
        .post(`/permissions`)
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

test('-------- Permissions Controller: PUT /permissions/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 201 for created';
    const expectedCode = 201;
    const permissionUuid = '9cc423a6-ade8-4a9a-ba09-913deabfd8da'; 
    const update_message = 'Should be updated'

    const updatedEntity = {
        action: 'GET',
        fk_endpoint: '/testputtt'
    };

    return request(app)
        .put(`/permissions/${permissionUuid}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedEntity)
        .expect(expectedCode)
        .then(res => {
            console.log(res)
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res._body._data.oermissions[0].action, updatedEntity.action, update_message);
            assert.equal(res._body._data.permissions[0].fk_endpoint, updatedEntity.fk_endpoint, update_message);
            assert.equal(res.body.code, expectedCode, messageForExpectedCode);
        })
        .catch(err => {
            assert.fail(err.message);
        });
});

test('-------- Permissions Controller: PUT /permissions/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;
    const permissionUuid = 'sdgarga'; 

    const updatedEntity = {
        action: 1,
        fk_endpoint: 1
    };

    return request(app)
        .put(`/permissions/${permissionUuid}`)
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

test('-------- Permissions Controller: DELETE /permissions/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;
    const permissionUuid = '9e8841de-2d33-49cb-a456-ed2a4a2e329a'

    return request(app)
        .get(`/permissions/${permissionUuid}`)
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

test('-------- Permissions Controller: DELETE /permissions/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const expectedCode           = 422;
    const permissionUuid = 'fdhsdh'

    return request(app)
        .get(`/permissions/${permissionUuid}`)
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

/*test('-------- Permissions Controller: DELETE /permissions/:uuid not found', () => {
    const messageForExpectedCode = 'Status code must be 404';
    const expectedCode           = 404;
    const permissionUuid = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/permissions/${permissionUuid}`)
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
