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

test('-------- Endpoints Controller: POST /endpoints', () => {
    const expectedCode = 201;

    const data = {
        "route": '/newRoute'
    };

    return request(app)
        .post('/endpoints')
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(data)
        .expect(expectedCode)
        .then((res) => {
            assert.ok(res);
            console.log(res)
            const {uuid, ...rest} = res._body._data.endpoints[0] //remove uuid from result body
            assert.deepStrictEqual(rest, data);
        })
        .catch((err) => {
            assert.fail(err.message); 
        })
        .finally(() => {
            server.close(); 
        });
});

test('-------- Endpoints Controller: POST /endpoints', () => {
    const messageForExpectedCode = 'Status code must be 400 for bad request';
    const messageForExpectedBody = `Message must contain devices in database'`;
    const expectedCode = 400;

    const data = {};

    return request(app)
        .post('/endpoints')
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

test('-------- Endpoints Controller: POST /endpoints unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;

    const updatedEntity = {
        "route" : 1
    };//good syntax but wrong data types

    return request(app)
        .post(`/endpoints`)
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

test('-------- Endpoints Controller: PUT /endpoints/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 201 for created';
    const expectedCode = 201;
    const endpointUuid = '9cc423a6-ade8-4a9a-ba09-913deabfd8da'; 
    const update_message = 'Should be updated'

    const updatedEntity = {
        "route": '/updatedRoute'
    };

    return request(app)
        .put(`/endpoints/${endpointUuid}`)
        .set('Authorization', `Bearer ${userToken}`) // Set the authorization header
        .send(updatedEntity)
        .expect(expectedCode)
        .then(res => {
            assert.ok(res.body); //check if response body is not empty
            assert.equal(res._body._data.endpoints[0].route, updatedEntity.route, update_message);
        })
        .catch(err => {
            assert.fail(err.message);
        });
});

test('-------- Endpoints Controller: PUT /endpoints/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422 for unprocessable entity';
    const expectedCode = 422;
    const endpointUuid = 'sdgarga'; 

    const updatedEntity = {
        "route" : '/updatedRoute'
    };

    return request(app)
        .put(`/endpoints/${endpointUuid}`)
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

test('-------- Endpoints Controller: DELETE /endpoints/:uuid', () => {
    const messageForExpectedCode = 'Status code must be 200';
    const expectedCode           = 200;
    const endpointUuid = '9e8841de-2d33-49cb-a456-ed2a4a2e329a'

    return request(app)
        .get(`/endpoints/${endpointUuid}`)
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

test('-------- Endpoints Controller: DELETE /endpoints/:uuid unprocessable entity', () => {
    const messageForExpectedCode = 'Status code must be 422';
    const expectedCode           = 422;
    const endpointUuid = 'fdhsdh'

    return request(app)
        .get(`/endpoints/${endpointUuid}`)
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

test('-------- Endpoints Controller: DELETE /endpoints/:uuid not found', () => {
    const messageForExpectedCode = 'Status code must be 404';
    const expectedCode           = 404;
    const endpointUuid = '41d303c1-6bef-4268-930a-85a73444173a'

    return request(app)
        .get(`/endpoints/${endpointUuid}`)
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