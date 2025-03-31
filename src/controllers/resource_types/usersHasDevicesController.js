import mysql from '../adapters/mysql'
import { 
    getUsersHasDevicesModel,
    countUsersHasDevicesModel,
    insertUsersHasDevicesModel,
    softDeleteUsersHasDevicesModel,
    modifyUsersHasDevicesModel
} from '../../repositories/resource_types/users_has_devicesRepository'
import { errorHandler } from '../../utils/errors'
import { noResults } from '../../validators/result-validators'

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
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const postUsersHasDevicesController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const createdBy = req.headers['uuid_requester'] || null

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

const deleteUsersHasDevicesController = (req, res, next, config) => {
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
    deleteUsersHasDevicesController,
    getDevicesByUserController
}
