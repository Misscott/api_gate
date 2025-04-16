import mysql from '../../adapters/mysql.js'
import { 
    getRolesHasPermissionsModel,
    countRolesHasPermissionsModel,
    insertRolesHasPermissionsModel,
    modifyRolesHasPermissionsModel,
    softDeleteRolesHasPermissionsModel
} from '../../models/authorization/roles_has_permissionsModel.js'
import { errorHandler } from '../../utils/errors.js'
import { noResults } from '../../validators/result-validators.js'
import { error404 } from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'

const getRolesHasPermissionsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuidList = req.query.uuidList && req.query.uuidList.split(',')
    Promise.all([
        getRolesHasPermissionsModel({...req.query, ...req.params, uuidList, conn}),
        countRolesHasPermissionsModel({...req.query, uuidList, conn})
    ])
        .then(([getResults, countResults]) => {
            next({
                _data: {roles_has_permissions: getResults},
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

const getRolesHasPermissionsByUuidController = (req, res, next, config) => {
    const uuid = req.params.uuid
    const conn = mysql.start(config)
    getRolesHasPermissionsModel({ uuid, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    roles_has_permissions: response
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

const postRolesHasPermissionsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const createdBy = req.auth.user || null

    insertRolesHasPermissionsModel({...req.body, ...req.params, createdBy, conn})
        .then((roles_has_permissions) => {
            const result = {
                _data: roles_has_permissions
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

const putRolesHasPermissionsController = (req, res, next, config) => {
    const conn = mysql.start(config)

    modifyRolesHasPermissionsModel({ ...req.body, ...req.params, conn })
        .then((roles_has_permissions) => {
            if (noResults(roles_has_permissions)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }
            const result = {
                _data: roles_has_permissions
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

const softDeleteRolesHasPermissionsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const { deleted } = req.body
	const deletedby = req.auth.user || null

    softDeleteRolesHasPermissionsModel({ ...req.params, deleted, deletedby, conn })
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
    getRolesHasPermissionsController,
    getRolesHasPermissionsByUuidController,
    postRolesHasPermissionsController,
    softDeleteRolesHasPermissionsController,
    putRolesHasPermissionsController,
}