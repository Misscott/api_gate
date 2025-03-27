/**
 * @fileoverview This file contains the route definitions for the user-related endpoints.
 */
import {Router} from 'express'                         
import { getDeviceController, postDeviceController, putDeviceController, deleteDeviceController, getDeviceByUuidController, getDeviceBySerialNumberController, getDeviceByModelController, getDeviceByBrandController, getDeviceswithMinimumStockController} from '../controllers/deviceController.js'
import { indexController } from '../controllers/indexController.js'
import { addLinks } from '../utils/links.js'
import { linkRoutes } from '../index.js'
import {
    sendCreatedResponse,
	sendOkResponse,
    sendResponseNoContent,
} from '../utils/responses.js'
import { integer, uuid, varChar} from '../validators/expressValidator/customValidators.js'
import {payloadExpressValidator} from '../validators/expressValidator/payloadExpressValidator.js'
import { error422, errorHandler } from '../utils/errors.js'
import { authenticateToken } from '../validators/token_validator.js'

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
        authenticateToken
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
        indexController,
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

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
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceController(req, res, next, config),
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
    * @route DELETE /devices/{uuid}
    * @group Devices - Operations about devices
    * @param {string} uuid.path.required - The unique identifier for the device
    * @returns {SuccessResponse} 200 - Device deleted successfully
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 500 - Internal server error
    **/
    routes.delete(
        '/devices/:uuid',
        [   
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deleteDeviceController(req, res, next, config),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    )

    return routes
}