import {randomUUID as uuidv4} from 'node:crypto'
import mysql from '../../adapters/mysql.js'
import {
    countDeviceQuery,
    getDeviceQuery,
    insertDeviceQuery,
    modifyDeviceQuery,
    deleteDeviceQuery,
    softDeleteDeviceQuery
} from '../../repositories/resource_types/deviceRepository.js'
import dayjs from 'dayjs'

/**
 * select/get model for device
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing select query and what happens if it is correctly resolved 
 */
const getDeviceModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(getDeviceQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

/**
 * Select count/get model for device
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing selectcount query and what happens if it is correctly resolved 
 */
const countDeviceModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

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
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    const paramsToInsert = {...params, uuid, now}
    return mysql
        .execute(insertDeviceQuery(paramsToInsert), conn, paramsToInsert)
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
        .catch(err => {
            reject(err)
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
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

/**
 * 
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing delete query  
 */
const deleteDeviceModel = ({conn, ...params}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc.format('YYYY-MM-DD HH:mm:ss')
    
    return mysql
        .execute(softDeleteDeviceQuery({ ...params, deleted: deletedData }), conn, { ...params, deleted: deletedData })
}

export {countDeviceModel, getDeviceModel, insertDeviceModel, modifyDeviceModel, deleteDeviceModel}

