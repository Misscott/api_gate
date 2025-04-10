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

test('-------- Endpoints Controller: GET /endpoints', () => {
  const expectedCode = 200;

    return request(app)
        .get('/endpoints')
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

test('-------- Endpoints Controller: GET /endpoints/:uuid', () => {
    const expectedCode = 200;
    const endpointUuid = 'c751f8fc-0f95-11f0-8cdf-bce92f8462b5'; 
  
    return request(app)
        .get(`/endpoints/${endpointUuid}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res)
            const {uuid, ...rest} = res._body._data.endpoints[0]; //remove uuid from result body
            assert.deepStrictEqual(rest, {
                id: 1,
                route: '/'
            })
        })
        .catch(err => {
            assert.fail(err.message);
        })
        .finally(() => {
            server.close();
        })
});

test('-------- Endpoints Controller: GET /endpoints/:uuid unprocessable entity', () => {
    const expectedCode = 422;
    const endpointUuid = 'diagjpawhpg'; 

    return request(app)
        .get(`/endpoints/${endpointUuid}`)
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

/*test('-------- Endpoints Controller: GET /endpoints/:uuid not found (deleted endpoint)', () => {
    const messageForExpectedCode = 'Status code must be 404 for not found';
    const expectedCode = 404;
    const endpointUuid = '9a4ca537-4a36-4ac8-886e-bc25581ac705'; 
  
    return request(app)
        .get(`/endpoints/${endpointUuid}`)
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