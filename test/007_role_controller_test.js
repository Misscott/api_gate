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

test('-------- Users Controller: GET /roles', () => {
  const expectedCode = 200;

    return request(app)
        .get('/roles')
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

test('-------- Roles Controller: GET /roles/:uuid', () => {
    const expectedCode = 200;
    const roleUuid = '92691396-0ed5-11f0-8154-bce92f8462b5'; 
  
    return request(app)
        .get(`/roles/${roleUuid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res)
            console.log(res)
            const {uuid, ...rest} = res._body._data.role[0]; //remove uuid from result body
            assert.deepStrictEqual(rest, {
                name: 'admin'
            })
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
});

test('-------- Roles Controller: GET /roles/:uuid unprocessable entity', () => {
    const expectedCode = 422;
    const roleUUID = 'diagjpawhpg'; 

    return request(app)
        .get(`/roles/${roleUUID}`)
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

test('-------- Roles Controller: GET /roles/:uuid not found (deleted role)', () => {
    const messageForExpectedCode = 'Status code must be 404 for not found';
    const expectedCode = 404;
    const roleUuid = '9a4ca537-4a36-4ac8-886e-bc25581ac705'; 
  
    return request(app)
        .get(`/roles/${roleUuid}`)
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

test('-------- Roles Controller: POST /roles', () => {
    const expectedCode = 201;

    const data = {
        "name": 'role name'
    };

    return request(app)
        .post('/roles')
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            console.log(res)
            const {uuid, ...rest} = res._body._data.role[0] //remove uuid from result body
            assert.deepStrictEqual(rest, data);
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});

test('-------- Roles Controller: POST /roles', () => {
    const messageForExpectedCode = 'Status code must be 400 for bad request';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode = 400;

    const data = {};

    return request(app)
        .post('/roles')
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

test('-------- Roles Controller: POST /roles unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;

    const updatedEntity = {
        "name" : 1
    };//good syntax but wrong data types

    return request(app)
        .post(`/roles`)
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

test('-------- Roles Controller: PUT /roles/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 201 for created';
    const expectedCode = 201;
    const userUuid = '9cc423a6-ade8-4a9a-ba09-913deabfd8da'; 
    const update_message = 'Should be updated'

    const updatedEntity = {
        "name": 'Updated name'
    };

    return request(app)
        .put(`/roles/${userUuid}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedEntity)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res._body._data.role[0].name, updatedEntity.name, update_message);
        })
        .catch(err => {
            assert.fail(err.message);
        });
});

test('-------- Roles Controller: PUT /roles/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;
    const roleUuid = 'sdgarga'; 

    const updatedEntity = {
        "name" : 'Updated name'
    };

    return request(app)
        .put(`/roles/${roleUuid}`)
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

test('-------- Roles Controller: DELETE /roles/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;
    const roleUuid = '9e8841de-2d33-49cb-a456-ed2a4a2e329a'

    return request(app)
        .get(`/roles/${roleUuid}`)
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

test('-------- Roles Controller: DELETE /roles/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const expectedCode           = 422;
    const roleUuid = 'fdhsdh'

    return request(app)
        .get(`/roles/${roleUuid}`)
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

test('-------- Roles Controller: DELETE /roles/:uuid not found', () => {
    const messageForExpectedCode = 'Status code must be 404';
    const expectedCode           = 404;
    const roleUuid = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/roles/${roleUuid}`)
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
