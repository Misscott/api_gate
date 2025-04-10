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

test('-------- Users Controller: GET /users', () => {
  const expectedCode = 200;

    return request(app)
        .get('/users')
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

test('-------- Users Controller: GET /users/:uuid', () => {
    const expectedCode = 200;
    const userUuid = '4c56d83c-d86c-4c75-87d1-c373b392d754'; 
  
    return request(app)
        .get(`/users/${userUuid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res)
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
});

test('-------- Users Controller: GET /users/:uuid unprocessable entity', () => {
    const expectedCode = 422;
    const userUUID = 'diagjpawhpg'; 

    return request(app)
        .get(`/users/${userUUID}`)
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

test('-------- Users Controller: GET /users/:uuid not found (deleted user)', () => {
    const messageForExpectedCode = 'Status code must be 404 for not found';
    const expectedCode = 404;
    const userUuid = '9a4ca537-4a36-4ac8-886e-bc25581ac705'; 
  
    return request(app)
        .get(`/users/${userUuid}`)
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

test('-------- Users Controller: POST /users', () => {
    const expectedCode = 201;

    const data = {
        "username": "noliholi3",
        "password": "noli_password",
        "email": null,
        "fk_role": 'viewer'
    };

    return request(app)
        .post('/users')
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            console.log(res)
            const {uuid, ...rest} = res._body._data.user[0] //remove uuid from result body
            assert.deepStrictEqual(rest, data);
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});

test('-------- Users Controller: POST /users', () => {
    const messageForExpectedCode = 'Status code must be 400 for bad request';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode = 400;

    const data = {};

    return request(app)
        .post('/users')
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

test('-------- Users Controller: POST /users unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;

    const updatedUser = {
        username: 1,
        password: 2
    };//good syntax but wrong data types

    return request(app)
        .post(`/users`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedUser)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res.body.code, expectedCode, messageForExpectedCode);
        })
        .catch(err => {
            assert.fail(err.message);
        });
})

test('-------- Users Controller: PUT /users/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 201 for created';
    const expectedCode = 201;
    const userUuid = '736b0f45-c5dc-41c4-805a-6258bd37b57b'; 
    const update_message = 'Should be updated'
    const fk_role_id = 2

    const updatedEntity = {
        "username": 'Updated username',
        "password": 'Updated password',
        "email": "hola@hola.com",
        "fk_role": '92692470-0ed5-11f0-8154-bce92f8462b5'
    };

    return request(app)
        .put(`/users/${userUuid}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedEntity)
        .expect(expectedCode)
        .then(res => {
            console.log(res)
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res._body._data.users[0].username, updatedEntity.username, update_message);
            assert.equal(res._body._data.users[0].email, updatedEntity.email, update_message);
            assert.equal(res._body._data.users[0].fk_role, fk_role_id, update_message);
        })
        .catch(err => {
            assert.fail(err.message);
        });
});

test('-------- Devices Controller: PUT /users/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;
    const userUuid = 'sdgarga'; 

    const updatedDevice = {
        "username": 'Updated username',
        "password": 'Updated password',
        "email": "hola@hola.com",
        "fk_role": 'viewer'
    };

    return request(app)
        .put(`/users/${userUuid}`)
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

test('-------- Users Controller: DELETE /users/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;
    const userUuid = '751a1761-93ee-4b89-afcf-5f2bb10fe03f'

    return request(app)
        .get(`/users/${userUuid}`)
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

test('-------- Users Controller: DELETE /users/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const expectedCode           = 422;
    const userUuid = 'fdhsdh'

    return request(app)
        .get(`/users/${userUuid}`)
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

test('-------- Users Controller: DELETE /users/:uuid not found', () => {
    const messageForExpectedCode = 'Status code must be 404';
    const expectedCode           = 404;
    const userUuid = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/users/${userUuid}`)
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
