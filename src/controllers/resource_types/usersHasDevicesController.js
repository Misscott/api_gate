import mysql from '../../adapters/mysql.js'
import { 
    getUsersHasDevicesModel,
    countUsersHasDevicesModel,
    insertUsersHasDevicesModel,
    softDeleteUsersHasDevicesModel,
    modifyUsersHasDevicesModel
} from '../../models/resource_types/user_has_devicesModel.js'
import { error404, errorHandler } from '../../utils/errors.js'
import { noResults } from '../../validators/result-validators.js'
import { sendResponseNotFound } from '../../utils/responses.js'

const getUsersHasDevicesController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getUsersHasDevicesModel({...req.params,...req.query, conn}),
        countUsersHasDevicesModel({...req.query, conn})
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: {users_has_devices: getResults},
                _page: {
                    totalElements: countResults,
                    limit: req.query.limit || 100,
                    page: req.query.page || (countResults && 1) || 0
                }
            })
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const getForSaleDevicesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const isForSale = true;

    Promise.all([
        getUsersHasDevicesModel({isForSale, conn}),
        countUsersHasDevicesModel({isForSale, conn})
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: {devices: getResults},
                _page: {
                    totalElements: countResults,
                    limit: req.query.limit || 100,
                    page: req.query.page || (countResults && 1) || 0
                }
            })
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
} 

const postUsersHasDevicesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const createdBy = req.auth.user || null

    insertUsersHasDevicesModel({...req.body, ...req.params, createdBy, conn})
        .then((users_has_devices) => {
            const result = {
                _data: {users_has_devices}
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

const putUsersHasDevicesController = (req, res, next, config) => {
    const conn = mysql.start(config)

    modifyUsersHasDevicesModel({...req.body, ...req.params, conn})
        .then((users_has_devices) => {
            if (noResults(users_has_devices) || users_has_devices === undefined) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }
            const result = {
                _data: {users_has_devices}
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

const softDeleteUsersHasDevicesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const { deleted } = req.body
    const deletedBy = req.auth.user || null

    softDeleteUsersHasDevicesModel({...req.params, deleted, deletedBy, conn})
        .then(() => {
            const result = {}
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

export {
    getUsersHasDevicesController,
    postUsersHasDevicesController,
    putUsersHasDevicesController,
    softDeleteUsersHasDevicesController,
    getForSaleDevicesController
}
