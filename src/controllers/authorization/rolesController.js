import mysql from '../adapters/mysql'
import { 
    getRoleModel,
    countRoleModel,
    postRoleModel,
    putRoleModel,
    softDeleteRoleModel
 } from '../../models/authorization/roleModel'
import { error404, errorHandler } from '../../utils/errors'
import { sendResponseNotFound } from '../../utils/responses'
import { noResults } from '../../validators/result-validators'

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

const postRoleController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const createdby = req.headers['uuid-requester'] || null

	postRoleModel({ ...req.body, createdby, conn })
		.then((RoleInformation) => {
			const result = {
				_data: { Role: RoleInformation }
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

	putRoleModel({ ...req.body, uuid, conn })
		.then((RoleInformation) => {
			const result = {
				_data: {
					message: 'Role created',
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
	const { deleted } = req.body
	const deletedby = req.headers['uuid-requester'] || null

	softDeleteRoleModel({ uuid, deleted, deletedby, conn })
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
	putRoleController
}
