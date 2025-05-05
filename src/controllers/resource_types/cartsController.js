import {error404, errorHandler} from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'
import {noResults} from '../../validators/result-validators.js'
import mysql from '../../adapters/mysql.js'
import { getCartModel, countCartModel, insertCartModel, updateCartModel, deleteCartModel } from '../../models/resource_types/cartsModel.js'
import { get } from 'node:http'

const getCartController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getCartModel({...req.query, conn}),
        countCartModel({...req.query, conn})
    ])    
        .then(([getResults]) =>
            next({
                _data: {carts: getResults},
                _page: {
                    totalElements: getResults.length,
                    limit: req.query.limit || 100,
                    page: req.query.page || (getResults.length && 1) || 0
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

const getCartByUuidController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid
    getCartModel({...req.query, uuid, conn})
        .then((carts) => {
            if(noResults(carts)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            next({
                _data: {carts},
                _page: {
                    totalElements: getResults.length,
                    limit: req.query.limit || 100,
                    page: req.query.page || (getResults.length && 1) || 0
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


const insertCartController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const {user_uuid} = req.body

    insertCartModel({...req.body, conn, user_uuid})
        .then((cart) => {
            if(noResults(cart)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data : {cart}
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

const updateCartController = (req, res, next, config) => {
    const conn = mysql.start(config)

    updateCartModel({...req.body, conn})
        .then((cart) => {
            if(noResults(cart)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data : {cart}
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

const deleteCartController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const deletedBy = req.auth.user || null

    deleteCartModel({...req.body, conn, deletedBy})
        .then((cart) => {
            if(noResults(cart)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data : {cart}
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

export {
    getCartController,
    getCartByUuidController,
    insertCartController,
    updateCartController,
    deleteCartController
}



