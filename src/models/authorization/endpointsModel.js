import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import {
    countEndpointsQuery,
    getEndpointsQuery,
    insertEndpointsQuery,
    updateEndpointsQuery,
    deleteEndpointsQuery,
    softDeleteEndpointsQuery
} from '../../repositories/authorization/endpointsRepository.js'

const getEndpointsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(getEndpointsQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countEndpointsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}

    return mysql
        .execute(countEndpointsQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertEndpointsModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    const paramsToInsert = {...params, uuid, now, createdBy: params.createdBy}
    return mysql
        .execute(insertEndpointsQuery(paramsToInsert), conn, paramsToInsert)
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const modifyEndpointsModel = ({conn, ...params}) => {
    return mysql
        .execute(updateEndpointsQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);
  
            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const softDeleteEndpointsModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, deletedBy, deleted: deletedData}

    return mysql
        .execute(softDeleteEndpointsQuery(params), conn, params)
}

const deleteEndpointsModel = ({uuid, conn}) => {
    return mysql
        .execute(deleteEndpointsQuery({uuid}), conn, {uuid})
}

export {
    countEndpointsModel,
    getEndpointsModel,
    insertEndpointsModel,
    modifyEndpointsModel,
    softDeleteEndpointsModel,
    deleteEndpointsModel
}