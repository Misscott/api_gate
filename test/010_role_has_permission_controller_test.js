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

test('-------- Roles Has Permissions Controller: GET /roles_has_permissions', () => {
  const expectedCode = 200;

    return request(app)
        .get('/roles_has_permissions')
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

test('-------- Roles Has Permissions Controller: GET /roles_has_permissions/:uuid', () => {
    const expectedCode = 200;
    const rolePermissionsUuid = '1b21126b-0f98-11f0-8cdf-bce92f8462b5'; 
  
    return request(app)
        .get(`/roles_has_permissions/${rolePermissionsUuid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res)
            console.log(res)
            const {uuid, ...rest} = res._body._data.roles_has_permissions[0]; //remove uuid from result body
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
});

test('-------- Roles Has Permissions Controller: GET /roles_has_permissions/:uuid unprocessable entity', () => {
    const expectedCode = 422;
    const rolePermissionsUuid = 'diagjpawhpg'; 

    return request(app)
        .get(`/roles_has_permissions/${rolePermissionsUuid}`)
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

test('-------- Roles Has Permissions Controller: GET /roles_has_permissions/:uuid not found (deleted)', () => {
    const messageForExpectedCode = 'Status code must be 404 for not found';
    const expectedCode = 404;
    const rolePermissionsUuid = '9a4ca537-4a36-4ac8-886e-bc25581ac705'; 
  
    return request(app)
        .get(`/roles_has_permissions/${rolePermissionsUuid}`)
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
});

test('-------- roles_has_permissions Controller: POST /roles_has_permissions', () => {
    const expectedCode = 201;

    const data = {
        "fk_role": "9e8841de-2d33-49cb-a456-ed2a4a2e329a",
        "fk_permission": "c21a573e-13c0-11f0-b79a-bce92f8462b5",
    };

    const dataAssert = {
        action: 'DELETE',
        fk_endpoint: 22,
        permission_uuid: 'c21a573e-13c0-11f0-b79a-bce92f8462b5',
        role_name: 'señor un poco ocupado',
        role_uuid: '9e8841de-2d33-49cb-a456-ed2a4a2e329a'
    }

    return request(app)
        .post('/roles_has_permissions')
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            console.log(res)
            const {uuid, ...rest} = res._body._data[0] //remove uuid from result body
            assert.deepStrictEqual(rest, dataAssert);
            assert.equal(res.body.code, expectedCode, 'Status code must be 201 for created');
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});

test('-------- roles_has_permissions Controller: POST /roles_has_permissions bad request', () => {
    const messageForExpectedCode = 'Status code must be 400 for bad request';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode = 400;

    const data = {};

    return request(app)
        .post('/roles_has_permissions')
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

test('-------- roles_has_permissions Controller: POST /roles_has_permissions unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;

    const updatedEntity = {
        "fk_role" : 1,
        "fk_permission": 2,
    };//good syntax but wrong data types

    return request(app)
        .post(`/roles_has_permissions`)
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

test('-------- roles_has_permissions Controller: PUT /roles_has_permissions/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 201 for created';
    const expectedCode = 201;
    const rolePermissionsUuid = '9cc423a6-ade8-4a9a-ba09-913deabfd8da'; 
    const update_message = 'Should be updated'

    const updatedEntity = {
        "route": '/updatedRoute'
    };

    return request(app)
        .put(`/roles_has_permissions/${rolePermissionsUuid}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedEntity)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
        })
        .catch(err => {
            assert.fail(err.message);
        });
});

test('-------- roles_has_permissions Controller: PUT /roles_has_permissions/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;
    const rolePermissionsUuid = 'sdgarga'; 

    const updatedEntity = {
        "route" : '/updatedRoute'
    };

    return request(app)
        .put(`/roles_has_permissions/${rolePermissionsUuid}`)
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

test('-------- roles_has_permissions Controller: DELETE /roles_has_permissions/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;
    const rolePermissionsUuid = '9e8841de-2d33-49cb-a456-ed2a4a2e329a'

    return request(app)
        .get(`/roles_has_permissions/${rolePermissionsUuid}`)
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

test('-------- roles_has_permissions Controller: DELETE /roles_has_permissions/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const expectedCode           = 422;
    const rolePermissionsUuid = 'fdhsdh'

    return request(app)
        .get(`/roles_has_permissions/${rolePermissionsUuid}`)
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

test('-------- roles_has_permissions Controller: DELETE /roles_has_permissions/:uuid not found', () => {
    const messageForExpectedCode = 'Status code must be 404';
    const expectedCode           = 404;
    const rolePermissionsUuid = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/roles_has_permissions/${rolePermissionsUuid}`)
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
