import {randomUUID as uuidv4} from 'node:crypto'
import mysql from '../adapters/mysql.js'
import {
    countDeviceQuery,
    getDeviceQuery,
    insertDeviceQuery,
    modifyDeviceQuery,
    deleteDeviceQuery
} from '../repositories/deviceRepository.js'

/**
 * select/get model for device
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing select query and what happens if it is correctly resolved 
 */
const getDeviceModel = ({conn, ...rest}) => {
    const paramsToSearch = {...rest}

    return mysql
        .execute(getDeviceQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, ...resultFiltered}) => resultFiltered))
}

/**
 * Select count/get model for device
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing selectcount query and what happens if it is correctly resolved 
 */
const countDeviceModel = ({conn, ...rest}) => {
    const paramsToSearch = {...rest}

    return mysql
        .execute(countDeviceQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

/**
 * Insert model for device
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} either resolve or reject
 */
const insertDeviceModel = ({conn, ...params}) => {
    const uuid = uuidv4()
    return mysql
        .execute(insertDeviceQuery({...params, uuid}), conn, {...params, uuid})
        .then(queryResult => queryResult[1].map(({id, ...resultFiltered}) => resultFiltered))
        .catch(err => {
            debugger
            return Promise.reject(err)
        })
}

/**
 * Modify model for device
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing update query and what happens if it is correctly resolved
 */
const modifyDeviceModel = ({conn, ...params}) => {
    return mysql
        .execute(modifyDeviceQuery(params), conn, params)
        .then(queryResult => queryResult[1].map(({id, ...resultFiltered}) => resultFiltered))
}

/**
 * 
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing delete query  
 */
const deleteDeviceModel = ({conn, ...params}) => {
    return mysql    
        .execute(deleteDeviceQuery({...params}), conn, {...params})
}

export {countDeviceModel, getDeviceModel, insertDeviceModel, modifyDeviceModel, deleteDeviceModel}

