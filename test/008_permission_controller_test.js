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