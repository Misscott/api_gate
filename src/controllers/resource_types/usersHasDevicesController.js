import mysql from '../../adapters/mysql.js'
import { 
    getUsersHasDevicesModel,
    countUsersHasDevicesModel,
    insertUsersHasDevicesModel,
    softDeleteUsersHasDevicesModel,
    modifyUsersHasDevicesModel
} from '../../models/resource_types/user_has_devicesModel.js'
import { errorHandler } from '../../utils/errors.js'
import { noResults } from '../../validators/result-validators.js'
import { error404 } from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'

const getUsersHasDevicesController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getUsersHasDevicesModel({...req.query, conn}),
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

const getDevicesByUserController = (req, res, next, config) => {
    const uuid_user = req.params.uuid
    const conn = mysql.start(config)

    getUsersHasDevicesModel({ uuid_user, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    users_has_devices: response
                }
            }
            next(result)
        })
        .catch((err) => {
            if (err.code === 'ER_DUP_ENTRY') {
                const error = errorHandler(err, config.environment)
                return res.status(error.code).json(error)
            }
            if (err.code === 'ER_BAD_NULL_ERROR') {
                const error = error404()
                return res.status(error.code).json(error)
            }
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

    insertUsersHasDevicesModel({...req.body, createdBy, conn})
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
    const uuid = req.params.uuid

    modifyUsersHasDevicesModel({...req.body, uuid, conn})
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
    const uuid = req.params.uuid
    const { deleted } = req.body
    const deletedBy = req.headers['uuid_requester'] || null

    softDeleteUsersHasDevicesModel({uuid, deleted, deletedBy, conn})
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
    getDevicesByUserController
}
