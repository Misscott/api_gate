import mysql from '../../adapters/mysql.js'
import {
    countDeviceModel,
    getDeviceModel,
    insertDeviceModel,
    modifyDeviceModel,
    deleteDeviceModel
} from '../../models/resource_types/deviceModel.js'
import {error404, errorHandler} from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'
import {noResults} from '../../validators/result-validators.js'

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
                _data: {devices: getResults},
                _page: {
                    totalElements: getResults.length,
                    limit: req.query.limit || 100,
                    page: req.query.page || (getResults.length && 1) || 0
                }
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
 * Generic controller request for selecting device/s from a certain parameter
 * @param {String} field param from request to be used for call
 */
const getDeviceByFieldController = (field) => (req, res, next, config) => {
    const conn = mysql.start(config)
    const fieldValue = req.params[field]

    getDeviceModel({[field]: fieldValue, conn})
        .then((device) => {
            if(noResults(device)){
                const err = error404()
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
    const createdBy = req.auth.user || null
    
    insertDeviceModel({...req.body, createdBy, conn})
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
    const deletedBy = req.auth.user || null

    deleteDeviceModel({uuid, conn, deletedBy})
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

export {
    getDeviceController,
    postDeviceController,
    putDeviceController,
    deleteDeviceController,
    getDeviceByUuidController
}