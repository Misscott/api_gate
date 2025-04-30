import { countAvailableDevicesModel, getAvailableDevicesModel } from "../../models/resource_types/availableDevicesModel.js"
import mysql from '../../adapters/mysql.js'
import { errorHandler} from '../../utils/errors.js'

const getAvailableDevicesController = (req, res, next, config) => {
    const conn = mysql.start(config)

    Promise.all([
        getAvailableDevicesModel({...req.query, conn}),
        countAvailableDevicesModel({...req.query, conn})
    ])    
        .then(([getResults]) =>
            next({
                _data: {devices: getResults},
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

export {
    getAvailableDevicesController
}