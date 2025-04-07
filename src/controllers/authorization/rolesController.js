import mysql from '../../adapters/mysql.js'
import { 
    getRoleModel,
    countRoleModel,
    insertRoleModel,
    modifyRoleModel,
    softDeleteRoleModel
 } from '../../models/authorization/roleModel.js'
import { error404, errorHandler } from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'
import { noResults } from '../../validators/result-validators.js'

const getRoleController = (req, res, next, config) => {
    // Parse and validate pagination parameters with defaults
    const limit = parseInt(req.query.limit, 10) || 100;
    const page = parseInt(req.query.page, 10) || 1;
    
    // Create sanitized query object
    const queryParams = { 
        ...req.query,
        limit,
        page
    };
    
    const conn = mysql.start(config)

    Promise.all([
        getRoleModel({ ...queryParams, conn }),
        countRoleModel({ ...queryParams, conn })
    ])
        .then(([getResults, countResults]) => {
            // Calculate total pages for frontend pagination
            const totalPages = Math.ceil(countResults / limit);
            
            next({
                _data: { Role: getResults },
                _page: {
                    totalElements: countResults,
                    totalPages,
                    limit,
                    page
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

const getRoleInfoController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid

	getRoleModel({ uuid, conn })
		.then((RoleInformation) => {
			if (noResults(RoleInformation)) {
				const err = error404()
				const error = errorHandler(err, config.environment)
				return sendResponseNotFound(res, error)
			}

			const result = {
				_data: {
					Role: RoleInformation
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

const postRoleController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const createdBy = req.auth.user || null

	insertRoleModel({ ...req.body, createdBy, conn })
		.then((RoleInformation) => {
			const result = {
				_data: { role: RoleInformation }
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

const putRoleController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid

	modifyRoleModel({ ...req.body, uuid, conn })
		.then((RoleInformation) => {
			const result = {
				_data: {
					message: 'Role modified',
					Role: RoleInformation
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

const deleteRoleController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid
	const deletedby = req.auth.user || null

	softDeleteRoleModel({ uuid, deletedby, conn })
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
	deleteRoleController,
	getRoleController,
	getRoleInfoController,
	postRoleController,
	putRoleController
}
