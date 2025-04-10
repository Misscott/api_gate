import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { 
    countPermissionsQuery,
    getPermissionsQuery,
    insertPermissionsQuery,
    modifyPermissionsQuery,
    softDeletePermissionsQuery
} from '../../repositories/authorization/permissionsRepository.js'

const getPermissionModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(getPermissionsQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countPermissionModel = ({conn, ...rest}) => { 
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(countPermissionsQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertPermissionModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    return mysql
        .execute(insertPermissionsQuery({...params, uuid, now}), conn, {...params, uuid, now})
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const modifyPermissionModel = ({conn, ...params}) => {
    return mysql
        .execute(modifyPermissionsQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);
  
            if (deletedItem) {
                throw error404()
            }
            
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const softDeletePermissionModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, deletedBy, deleted: deletedData}

    return mysql
        .execute(softDeletePermissionsQuery(params), conn, params)
}

export {
    getPermissionModel,
    countPermissionModel,
    modifyPermissionModel,
    insertPermissionModel,
    softDeletePermissionModel
}