import mysql from '../../adapters/mysql.js'
import { 
    getRolesHasPermissionsModel,
    countRolesHasPermissionsModel,
    insertRolesHasPermissionsModel,
    modifyRolesHasPermissionsModel,
    softDeleteRolesHasPermissionsModel
} from '../../models/authorization/roles_has_permissionsModel.js'
import { error404, errorHandler } from '../../utils/errors.js'
import { noResults } from '../../validators/result-validators.js'

const getRolesHasPermissionsController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getRolesHasPermissionsModel({...req.query, uuidList, conn}),
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

const getRolesHasPermissionsControllerByRoleName = (req, res, next, config) => {
    const conn = mysql.start(config)
    const roleName = req.params.name

    getRolesHasPermissionsModel({ roleName, conn })
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

const getPermissionsByRoleController = (req, res, next, config) => {
    const uuid_role = req.params.uuid
    const conn = mysql.start(config)

    getRolesHasPermissionsModel({ uuid_role, conn })
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
    const roleUuid = req.body.uuid

    insertRolesHasPermissionsModel({...req.body, roleUuid, createdBy, conn})
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
    const uuid = req.params.uuid

    modifyRolesHasPermissionsModel({ ...req.body, uuid, modifiedBy, conn })
        .then((roles_has_permissions) => {
            const result = {
                _data: roles_has_permissions
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

const softDeleteRolesHasPermissionsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid
    const { deleted } = req.body
	const deletedby = req.auth.user || null

    softDeleteRolesHasPermissionsModel({ uuid, deleted, deletedby, conn })
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
    getPermissionsByRoleController,
    postRolesHasPermissionsController,
    softDeleteRolesHasPermissionsController,
    getRolesHasPermissionsControllerByRoleName,
    putRolesHasPermissionsController,
}