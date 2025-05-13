import {error404, errorHandler} from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'
import {noResults} from '../../validators/result-validators.js'
import mysql from '../../adapters/mysql.js'
import { 
    getCartItemsModel,
    countCartItemsModel,
    insertCartItemsModel,
    updateCartItemsModel,
    deleteCartItemsModel,
    mergeCartModel
 } from '../../models/resource_types/cartItemsModel.js'

const getCartItemsController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getCartItemsModel({...req.query, ...req.params, conn}),
        countCartItemsModel({...req.query, conn})
    ])    
        .then(([getResults]) =>
            next({
                _data: {cart_items: getResults},
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

const insertCartItemsController = (req, res, next, config) => {
    const createdBy = req.auth?.user || null
    const conn = mysql.start(config)

    insertCartItemsModel({...req.body, ...req.params, conn, createdBy})
        .then((cartItems) => {
            if(noResults(cartItems)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data : {cart_items: cartItems}
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

const mergeCartController = (req, res, next, config) => {
    const conn = mysql.start(config)

    mergeCartModel({...req.body, ...req.params, conn})
        .then((cartItems) => {
            if(noResults(cartItems)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data : {cart_items: cartItems}
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

const updateCartItemsController = (req, res, next, config) => {
    const conn = mysql.start(config)

    updateCartItemsModel({...req.body, ...req.params, conn})
        .then((cartItems) => {
            if(noResults(cartItems)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data : {cart_items: cartItems}
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

const deleteCartItemsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid

    deleteCartItemsModel({...req.body, ...req.params, uuid, conn})
        .then((cartItems) => {
            if(noResults(cartItems)){
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data : {cart_items: cartItems}
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
    getCartItemsController,
    insertCartItemsController,
    updateCartItemsController,
    deleteCartItemsController,
    mergeCartController
}