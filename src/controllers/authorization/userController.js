import bcrypt from 'bcrypt'
import mysql from '../../adapters/mysql.js'
import { 
    getUserListModel,
    countUserListModel,
    insertUserModel,
    modifyUserModel,
    softDeleteUserModel    
} from '../../models/authorization/userModel.js'
import { error404, errorHandler } from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'
import { noResults } from '../../validators/result-validators.js'

const getUserListController = (req, res, next, config) => {
    const uuidList = req.query.uuidList && req.query.uuidList.split(',')
    const conn = mysql.start(config)

    Promise.all([
        getUserListModel({...req.query, uuidList, conn}),
        countUserListModel({...req.query, uuidList, conn})
    ])
        .then(([getResults, countResults]) => {
            //exclude password (confidential)
            const users = getResults.map(({password, ...rest}) => rest)

            next({
                _data: {users},
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

const getUserInfoController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid

	getUserListModel({ uuid, conn })
		.then((response) => {
			if (noResults(response)) {
				const err = error404()
				const error = errorHandler(err, config.environment)
				return sendResponseNotFound(res, error)
			}

			// exclude password (confidential)
			const users = response.map(({ password, ...rest }) => rest)

			const result = {
				_data: {
					users
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

const postUserController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const createdby = req.headers['uuid-requester'] || null
	const { username, password} = req.body

    //encrypt password
	bcrypt
		.hash(password, config.saltRounds)
		.then(hash => insertUserModel({ username, password: hash, email, fk_role, createdby, conn }))
		.then((users) => {
			const result = {
				_data: {
					message: 'User created',
					users
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

const putUserController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid

	modifyUserModel({ ...req.body, uuid, conn })
		.then((users) => {
			const result = {
				_data: {
					message: 'User modified',
					users
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

const softDeleteUserController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid
	const { deleted } = req.body
	const deletedby = req.headers['uuid-requester'] || null

	softDeleteUserModel({ uuid, deleted, deletedby, conn })
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

export { softDeleteUserController, getUserInfoController, getUserListController, postUserController, putUserController }