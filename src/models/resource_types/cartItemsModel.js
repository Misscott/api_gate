import dayjs from "dayjs";
import {randomUUID as uuidv4} from 'node:crypto'
import mysql from '../../adapters/mysql.js'
import {
    getCartItemsQuery,
    countCartItemsQuery,
    insertCartItemsQuery,
    updateCartItemsQuery,
    deleteCartItemsQuery
} from '../../repositories/resource_types/cartItemsRepository.js'
import {error404} from '../../utils/errors.js'

const getCartItemsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(getCartItemsQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countCartItemsModel = ({conn, ...rest}) => {  
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(countCartItemsQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertCartItemsModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    const paramsToInsert = {...params, uuid, now}

    return mysql
        .execute(insertCartItemsQuery(paramsToInsert), conn, paramsToInsert)
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}


const updateCartItemsModel = ({conn, ...params}) => {
    return mysql
        .execute(updateCartItemsQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);

            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const deleteCartItemsModel = ({conn, ...params}) => {
    return mysql
        .execute(deleteCartItemsQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);

            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

export {
    getCartItemsModel,
    countCartItemsModel,
    insertCartItemsModel,
    updateCartItemsModel,
    deleteCartItemsModel
}