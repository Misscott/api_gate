import { getUsersHasDevicesModel, modifyUsersHasDevicesModel } from "../../models/resource_types/user_has_devicesModel"
import { errorHandler } from "../../utils/errorHandler"
import mysql from "../../database/mysql"

const stockAvailabilityController = (req, res, next, config) => {
    const conn = mysql.start(config)
    
    const stockChecks = req.body.items.map((item) => {
        return getUsersHasDevicesModel(
            { device_uuid: item.device_uuid, seller_uuid: item.seller_uuid },
            conn
        )
        .then((data) => {
            return {
                stock: data[0]?.stock, 
                device_uuid: item.device_uuid,
                seller_uuid: item.seller_uuid,
                quantity: item.cart_item_quantity, 
                valid: data[0]?.stock >= item.cart_item_quantity
            }
        })
    })
    
    Promise.all(stockChecks)
        .then((results) => {
            const allItemsValid = results.every((result) => result.valid);
            next({ items: results, valid: allItemsValid })
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

const stockUpdateController = (result, req, res, next, config) => {
    if(!result.valid){
        return
    }
    
    const conn = mysql.start(config)
    
    const updatePromises = result.items.map((item) => {
        const newStock = item.stock - item.quantity //unsigned
        return modifyUsersHasDevicesModel(
            {
                device_uuid: item.device_uuid,
                user_uuid: item.seller_uuid,
                stock: newStock
            },
            conn
        )
    })
    
    Promise.all(updatePromises)
        .then((updateResults) => {
            next(updateResults);
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            res.status(error.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

export { stockAvailabilityController, stockUpdateController };