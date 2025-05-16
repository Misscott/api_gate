import dayjs from "dayjs";
import {randomUUID as uuidv4} from 'node:crypto'
import mysql from '../../adapters/mysql.js'
import {
    getCartItemsQuery,
    countCartItemsQuery,
    insertCartItemsQuery,
    updateCartItemsQuery,
    deleteCartItemsQuery,
    mergeCartQuery,
    syncCartQuery
} from '../../repositories/resource_types/cartItemsRepository.js'
import {error404} from '../../utils/errors.js'

const getCartItemsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(getCartItemsQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, fk_user, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
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

const syncCartModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    const paramsToInsert = {...params, uuid, now, deleted: now}

    return mysql
        .execute(syncCartQuery(paramsToInsert), conn, paramsToInsert)
        .then(queryResult => queryResult[3].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const mergeCartModel = ({conn, ...params}) => {
    const paramsToInsert = {...params}

    return mysql
        .execute(mergeCartQuery(paramsToInsert), conn, paramsToInsert)
        .then(queryResult => queryResult[4].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const updateCartItemsModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToInsert = {...params, now}
    return mysql
        .execute(updateCartItemsQuery(paramsToInsert), conn, paramsToInsert)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);

            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const deleteCartItemsModel = ({conn, deleted, deletedBy, ...params}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    return mysql
        .execute(deleteCartItemsQuery({ ...params, deleted: deletedData, deletedBy }), conn, { ...params, deleted: deletedData, deletedBy })
}

export {
    getCartItemsModel,
    countCartItemsModel,
    insertCartItemsModel,
    updateCartItemsModel,
    deleteCartItemsModel,
    mergeCartModel,
    syncCartModel
}