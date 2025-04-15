import { 
    getEndpointsModel,
    countEndpointsModel,
    insertEndpointsModel,
    modifyEndpointsModel,
    softDeleteEndpointsModel,
    deleteEndpointsModel
 } from "../../models/authorization/endpointsModel.js";
import { error404, errorHandler } from "../../utils/errors.js";
import { sendResponseNotFound } from "../../utils/responses.js";
import { noResults } from "../../validators/result-validators.js";
import mysql from "../../adapters/mysql.js";

const getEndpointsController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getEndpointsModel({ ...req.query, conn }),
        countEndpointsModel({ ...req.query, conn })
    ])
        .then(([getResults, countResults]) =>
            next({
                _data: { endpoints: getResults },
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

const getEndpointsByUuidController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid

    getEndpointsModel({ uuid, conn })
        .then((endpointsInformation) => {
            if (noResults(endpointsInformation)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }

            const result = {
                _data: {
                    endpoints: endpointsInformation
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

const postEndpointsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const created_by = req.auth.user || null

    insertEndpointsModel({ ...req.body, created_by, conn })
        .then((endpoints) => {
            const result = {
                _data: { endpoints }
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

const putEndpointsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid

    modifyEndpointsModel({ ...req.body, uuid, conn })
        .then((endpoints) => {
            if (noResults(endpoints)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(endpoints, error)
            }
            const result = {
                _data: { endpoints }
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

const softDeleteEndpointsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid
    const deletedby = req.auth.user || null

    softDeleteEndpointsModel({ uuid, deletedby, conn })
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

const deleteEndpointsController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const uuid = req.params.uuid

    deleteEndpointsModel({ uuid, conn })
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
    getEndpointsController,
    getEndpointsByUuidController,
    postEndpointsController,
    putEndpointsController,
    softDeleteEndpointsController,
    deleteEndpointsController
}
