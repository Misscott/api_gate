/**
 * @fileoverview This file contains the route definitions for the user-related endpoints.
 */
import {Router} from 'express'             
import { getDeviceController, getDeviceByUuidController, postDeviceController, putDeviceController, deleteDeviceController, getDeviceswithMinimumStockController, getDeviceBySerialNumberController, getDeviceByModelController, getDeviceByBrandController } from '../controllers/resource_types/deviceController.js'
import { getUserListController, getUserInfoController, postUserController, putUserController, softDeleteUserController } from '../controllers/authorization/userController.js'
import { getRoleController, getRoleInfoController, postRoleController, putRoleController, deleteRoleController } from '../controllers/authorization/rolesController.js'
import { getPermissionController, getPermissionByUuidController, postPermissionController, putPermissionController, softDeletePermissionController } from '../controllers/authorization/permissionsController.js'
import { indexController } from '../controllers/indexController.js'
import { postLoginController } from '../controllers/authorization/loginController.js'
import { addLinks } from '../utils/links.js'
import { linkRoutes } from '../index.js'
import {
    sendCreatedResponse,
	sendLoginSuccessfullResponse,
	sendOkResponse,
    sendResponseNoContent,
} from '../utils/responses.js'
import { integer, uuid, varChar} from '../validators/expressValidator/customValidators.js'
import {payloadExpressValidator} from '../validators/expressValidator/payloadExpressValidator.js'
import { error422, errorHandler } from '../utils/errors.js'
import { authorizePermission, setToken, authenticateToken} from '../middlewares/auth.js'

/**
 * @function default 
 * @param {Object} configuration based on environment
 * @returns {Router} all endpoint routes
 */
export default(config) => {
    /**
    * Express router to mount user related functions on.
    * @type {Object}
    * @const
    * @namespace deviceRouter
    */
    const routes = Router()
    const hasAddLinks = config.environment !== 'production'

    /**
    * Gets message from data object result from index controller to check if server is up.
    * Ideally, if server is working correctly it should return message
    * @name get/
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /
    * @returns {Device} 200 - The data object with message 
    * @returns {ErrorResponse} 404 - Data not found
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/',
        (req, res, next) => indexController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    // Device routes
    /**
    * Gets all the devices from database
    * @name get/devices
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /devices
    * @group Devices - Operations about devices
    * @returns {Device} 200 - The devices object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/devices',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices')(req, res, next, config),
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @name post/devices
    * @function
    * @inner
    * @route POST /devices
    * @group Devices - Operations about devices
    * @memberof deviceRouter
    * @param {Device} req.body - The device object to create
    * @returns {SuccessResponse} 200 - Device created successfully/ Response OK
    * @returns {ErrorResponse} 400 - Bad request
    * @returns {ErrorResponse} 500 - Internal server error
    **/
    routes.post(
        '/devices',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => {
            const { serial_number, model, brand, description, stock } = req.body;
            if(!req.body || (!serial_number || !model || !brand || typeof stock !== 'number')){
                const error = errorHandler(error422(), config.environment)
                return res.status(error.code).json(error)
            } 
            return postDeviceController(req, res, next, config)
        },
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
     * Gets devices with a stock greater than zero
    * @name get/devices/inStock
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /devices/inStock
    * @group Devices - Operations about devices
    * @param {string} serial_number.path.required - The unique identifier for the device
    * @returns {Device} 200 - The device object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/devices/inStock',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/inStock')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceswithMinimumStockController(1)(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * Gets all the devices with a stock greater or equal to minStock
    * @name get/devices/minStock/:stock
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /devices/minStock/{minStock}
    * @group Devices - Operations about devices
    * @param {string} minStock param for minimum stock search
    * @returns {Device} 200 - The device object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/devices/minStock/:stock',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/minStock/:stock')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => {
            const minStock = Number(req.params.stock)
            getDeviceswithMinimumStockController(minStock)(req, res, next, config)
        },
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @route GET /devices/{uuid}
    * @group Devices - Operations about devices
    * @name get/devices/:uuid
    * @function
    * @inner
    * @memberof deviceRouter
    * @param {string} uuid.path.required - The unique identifier for the device
    * @returns {Device} 200 - The device object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @name get/devices/serial_number/:serial_number
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /devices/serial_number/{serial_number}
    * @group Devices - Operations about devices
    * @param {string} serial_number.path.required - The identifier for the devices
    * @returns {Device} 200 - The devices object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/devices/serial_number/:serial_number',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/serial_number/:serial_number')(req, res, next),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceBySerialNumberController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @name get/devices/model/:model
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /devices/model/{model}
    * @group Devices - Operations about devices
    * @param {string} model.path.required - The identifier for the devices
    * @returns {Device} 200 - The devices object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/devices/model/:model',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/model/:model')(req, res, next),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceByModelController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @name get/devices/brand/:brand
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /devices/brand/{brand}
    * @group Devices - Operations about devices
    * @param {string} brand.path.required - The identifier for the devices
    * @returns {Device} 200 - The devices object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/devices/brand/:brand',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/brand/:brand')(req, res, next),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceByBrandController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @name put/devices/:uuid
    * @function
    * @inner
    * @memberof deviceRouter
    * @route PUT /devices/{uuid}
    * @group Devices - Operations about devices
    * @param {string} uuid.path.required - The unique identifier for the device
    * @param {Device} req.body - The device object to update
    * @returns {SuccessResponse} 201 - Device created successfully
    * @returns {ErrorResponse} 400 - Bad request
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.put(
        '/devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putDeviceController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    )

    /**
    * @name delete/devices/:uuid
    * @function
    * @inner
    * @memberof deviceRouter
    * @route PUT /devices/{uuid}
    * @group Devices - Operations about devices
    * @param {string} uuid.path.required - The unique identifier for the device
    * @returns {SuccessResponse} 200 - Device deleted successfully
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 500 - Internal server error
    **/
    routes.put(
        '/devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/:uuid')(req, res, next, config),
        [   
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deleteDeviceController(req, res, next, config),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    )

    // User Routes
    routes.get(
        '/users',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('email').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.get(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserInfoController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/users',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users')(req, res, next, config),
        [
            varChar('username'),
            varChar('password'),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            uuid('fk_role')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    routes.get(
        '/roles',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.get(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRoleInfoController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/roles',
        (req, res, next) => authenticateToken(req, res, next, config),
        [
            varChar('name')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.delete(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deleteRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    routes.get(
        '/permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.get(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPermissionByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        [
            varChar('name')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.delete(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('permissions')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeletePermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Login Endpoint
    routes.post(
        '/login',
        [
            varChar('username'),
            varChar('password')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postLoginController(req, res, next, config),
        (result, req, res, next) => setToken(result, req, res, next),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendLoginSuccessfullResponse(result, req, res)
    );

    return routes;
}