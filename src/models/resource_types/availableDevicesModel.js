import { countAvailableDevicesQuery, getAvailableDevicesQuery } from "../../repositories/resource_types/availableDevicesRepository.js"
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
/**
 * select/get model for available devices
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing select query and what happens if it is correctly resolved 
 */
const getAvailableDevicesModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(getAvailableDevicesQuery(), conn, paramsToSearch)
}

/**
 * Select count/get model for device
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing selectcount query and what happens if it is correctly resolved 
 */
const countAvailableDevicesModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(countAvailableDevicesQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

export{
    countAvailableDevicesModel,
    getAvailableDevicesModel
}