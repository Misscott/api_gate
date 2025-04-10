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
            return res.status(error.code).json(error)
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
			return res.status(error.code).json(error)
		})
		.finally(() => {
			mysql.end(conn)
		})
}

const postUserController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const createdBy = req.auth.user || null
	const {username, password, email, fk_role} = req.body
	if (!username || !password) {
		const err = error404()
		return sendResponseNotFound(res, err)
	}
	//encrypt password
	bcrypt
		.hash(password, config.saltRounds)
		.then(hash => {
			insertUserModel({ conn, username, password: hash, email, fk_role, createdBy })
		})
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
			if (err.code === 'ER_DUP_ENTRY') {
                const error = errorHandler(err, config.environment)
                return res.status(error.code).json(error)
            }
            if (err.code === 'ER_BAD_NULL_ERROR') {
                const error = error404()
                return res.status(error.code).json(error)
            }
			const error = errorHandler(err, config.environment)
			return res.status(error).json(error)
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
			if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }
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
			return res.status(error.code).json(error)
		})
		.finally(() => {
			mysql.end(conn)
		})
}

const softDeleteUserController = (req, res, next, config) => {
	const conn = mysql.start(config)
	const uuid = req.params.uuid
	const deletedby = req.auth.user || null

	softDeleteUserModel({ uuid, deletedby, conn })
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

export { softDeleteUserController, getUserInfoController, getUserListController, postUserController, putUserController }