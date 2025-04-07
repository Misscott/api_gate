import { error404, errorHandler } from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'
import { noResults } from '../../validators/result-validators.js'
import mysql from '../../adapters/mysql.js'
import { 
    getPermissionModel,
    countPermissionModel,
    insertPermissionModel,
    modifyPermissionModel,
    softDeletePermissionModel
} from '../../models/authorization/permissionsModel.js'

const getPermissionController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getPermissionModel({...req.query, conn}),
        countPermissionModel({...req.query, conn})
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: {permissions: getResults},
                _page: {
                    totalElements: countResults,
                    limit: req.query.limit || 100,
                    page: req.query.page || (countResults && 1) || 0
                }
            })
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            return res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const getPermissionByUuidController = (req, res, next, config) => {
    const uuid_permission = req.params.uuid
    const conn = mysql.start(config)

    getPermissionModel({ uuid_permission, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    permissions: response
                }
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            return res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const postPermissionController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const created_by = req.auth.user || null

    insertPermissionModel({...req.body, created_by, conn})
        .then((response) => {
            const result = {
                _data: {
                    permissions: response
                }
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            return res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const putPermissionController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid_permission = req.params.uuid

    modifyPermissionModel({...req.body, uuid_permission, conn})
        .then((response) => {
            const result = {
                _data: {
                    permissions: response
                }
            }
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            return res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const softDeletePermissionController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid_permission = req.params.uuid
    const deletedBy = req.auth.user || null

    softDeletePermissionModel({uuid_permission, deletedBy, conn})
        .then(() => {
            const result = {}
            next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            return res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

export {
    getPermissionController,
    getPermissionByUuidController,
    postPermissionController,
    putPermissionController,
    softDeletePermissionController
}