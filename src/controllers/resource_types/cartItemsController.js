import {error404, errorHandler} from '../../utils/errors.js'
import { sendResponseNotFound } from '../../utils/responses.js'
import {noResults} from '../../validators/result-validators.js'
import mysql from '../../adapters/mysql.js'
import { 
    getCartItemsModel,
    countCartItemsModel,
    insertCartItemsModel,
    updateCartItemsModel,
    deleteCartItemsModel
 } from '../../models/resource_types/cartItemsModel.js'

const getCartItemsController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getCartItemsModel({...req.query, conn}),
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
    const conn = mysql.start(config)
    const {cart_uuid, product_uuid} = req.body

    insertCartItemsModel({...req.body, conn, cart_uuid, product_uuid})
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

    updateCartItemsModel({...req.body, conn})
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

    deleteCartItemsModel({...req.body, uuid, conn})
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
    deleteCartItemsController
}