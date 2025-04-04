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
	const conn = mysql.start(config)

	Promise.all([
		getRoleModel({ ...req.query, conn }),
		countRoleModel({ ...req.query, conn })
	])
		.then(([getResults, countResults]) =>
			next({
				_data: { Role: getResults },
				_page: {
					totalElements: countResults,
					limit: req.query.limit || 100,
					page: req.query.page || (countResults && 1) || 0
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
			res.status(error.code).json(error)
		})
		.finally(() => {
			mysql.end(conn)
		})
}

const getRoleByNameController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const name = req.params.name

	getRoleModel({ name, conn })
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
			res.status(error.code).json(error)
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
			res.status(error.code).json(error)
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
			res.status(error.code).json(error)
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
			res.status(error.code).json(error)
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
	putRoleController,
	getRoleByNameController
}
