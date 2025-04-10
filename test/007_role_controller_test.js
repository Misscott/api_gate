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