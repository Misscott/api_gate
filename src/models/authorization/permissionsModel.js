import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../adapters/mysql'
import { 
    countPermissionQuery,
    getPermissionQuery,
    insertPermissionQuery,
    modifyPermissionQuery,
    deletePermissionQuery,
    softDeletePermissionQuery
} from '../../repositories/authorization/permissionsRepository'

const getPermissionModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(getPermissionQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countPermissionModel = ({conn, ...rest}) => { 
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(countPermissionQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertPermissionModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    return mysql
        .execute(insertPermissionQuery({...params, uuid, now}), conn, {...params, uuid, now})
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
        .catch(err => {
            reject(err)
        })
}

const modifyPermissionModel = ({conn, ...params}) => {
    const params = {uuid, name, conn}
    return mysql
        .execute(modifyPermissionQuery(params), conn, params)
        .then(queryResult => queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const softDeletePermissionModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, deletedBy, deleted: deletedData}

    return mysql
        .execute(softDeletePermissionQuery(params), conn, params)
}

export {
    getPermissionModel,
    countPermissionModel,
    modifyPermissionModel,
    insertPermissionModel,
    softDeletePermissionModel
}