import mysql from '../adapters/mysql.js'
import {
    countDeviceModel,
    getDeviceModel,
    insertDeviceModel,
    modifyDeviceModel,
    deleteDeviceModel
} from '../models/deviceModel.js'
import {error404, errorHandler} from '../utils/errors.js'
import { sendResponseNotFound } from '../utils/responses.js'
import {noResults} from '../validators/result-validators.js'
import {filterByStock} from '../validators/filters.js'

/**
 * Controller request for selecting all devices from database
 * @param {Object} req request object to endpoint
 * @param {Object} res result object to handle response
 * @param {Function} next middleware to communicate with next logic layer
 * @param {Object} config environment configuration
 */
const getDeviceController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getDeviceModel({...req.query, conn}),
        countDeviceModel({...req.query, conn})
    ])    
        .then(([getResults]) =>
            next({
                _data: {devices: getResults}
            })
        )
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

/**
 * Gets devices based on a minimum stock from request params
 * @param {Integer} minStock 
 * @returns {errorHandler} if there are no results, error 404 for not found
 */
const getDeviceswithMinimumStockController = (minStock) => (req, res, next, config) => {
    const conn = mysql.start(config)

    getDeviceModel({conn})
        .then((device) => {
            if(noResults(device)){
                const err = error404
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const filteredDevices = filterByStock(device, minStock, Number.MAX_VALUE)
            const result = {
                _data : {filteredDevices}
            }

            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

/**
 * Generic controller request for selecting device/s from a certain parameter
 * @param {String} field param from request to be used for call
 */
const getDeviceByFieldController = (field) => (req, res, next, config) => {
    const conn = mysql.start(config)
    const fieldValue = req.params[field]

    getDeviceModel({fieldValue, conn})
        .then((device) => {
            if(noResults(device)){
                const err = error404
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data : {device}
            }

            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

/**
 * Controller request for inserting device 
 * @param {Object} req request object to endpoint
 * @param {Object} res result object to handle response
 * @param {Function} next middleware to communicate with next logic layer
 * @param {Object} config environment configuration
 */
const postDeviceController = (req, res, next, config) => {
    const conn = mysql.start(config)
    
    insertDeviceModel({...req.body, conn})
        .then((device) => {
            const result = {
                _data: device
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

/**
 * Controller request for modifying device
 * @param {Object} req request object to endpoint
 * @param {Object} res result object to handle response
 * @param {Function} next middleware to communicate with next logic layer
 * @param {Object} config environment configuration
 */
const putDeviceController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid
    
    modifyDeviceModel({...req.body, uuid, conn})
        .then((devices) => {
            if (noResults(devices)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
				_data: { devices }
			}
			next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

/**
 * Controller for deleting device 
 * @param {Object} req request object to endpoint
 * @param {Object} res result object to handle response
 * @param {Function} next middleware to communicate with next logic layer
 * @param {Object} config environment configuration
 */
const deleteDeviceController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid

    deleteDeviceModel({uuid, conn})
        .then(() => {
            const result = {message: "Device deleted successfully"}
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const getDeviceByUuidController = getDeviceByFieldController('uuid')
const getDeviceBySerialNumberController = getDeviceByFieldController('serial_number')
const getDeviceByModelController = getDeviceByFieldController('model')
const getDeviceByBrandController = getDeviceByFieldController('brand')

export {
    getDeviceController,
    postDeviceController,
    putDeviceController,
    deleteDeviceController,
    getDeviceByUuidController,
    getDeviceBySerialNumberController,
    getDeviceByBrandController,
    getDeviceByModelController,
    getDeviceswithMinimumStockController
}