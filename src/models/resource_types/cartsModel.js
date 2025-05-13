import {randomUUID as uuidv4} from 'node:crypto'
import mysql from '../../adapters/mysql.js'
import { countCartQuery,
    getCartQuery,
    insertCartQuery,
    updateCartQuery,
    deleteCartQuery
 } from '../../repositories/resource_types/cartsRepository.js'
import dayjs from 'dayjs'
import {errorHandler} from '../../utils/errors.js'


/**
 * select/get model for cart
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} resolve after executing select query and what happens if it is correctly resolved 
 */
const getCartModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(getCartQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countCartModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(countCartQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

/**
 * Insert model for cart
 * @param {Object} Object containing connection and parameters passed per as request 
 * @returns {Promise} either resolve or reject
 */
const insertCartModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss');
    const uuid = uuidv4();
    const { user_uuid } = params;
    const paramsToInsert = { ...params, uuid, now, user_uuid };
    return mysql
        .execute(insertCartQuery(paramsToInsert), conn, paramsToInsert)
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const updateCartModel = ({conn, ...params}) => {
    return mysql
        .execute(updateCartQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);
  
            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const deleteCartModel = ({conn, deleted, deletedBy, ...params}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    
    return mysql
        .execute(deleteCartQuery({ ...params, deleted: deletedData, deletedBy }), conn, { ...params, deleted: deletedData, deletedBy })
}

export {
    getCartModel,
    countCartModel,
    insertCartModel,
    updateCartModel,
    deleteCartModel
}


