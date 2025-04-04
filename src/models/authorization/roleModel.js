import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { 
    countRoleQuery,
    getRoleQuery,
    insertRoleQuery,
    modifyRoleQuery,
    deleteRoleQuery,
    softDeleteRoleQuery
 } from '../../repositories/authorization/rolesRepository.js'

const getRoleModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')

    return mysql
        .execute(getRoleQuery({...rest, now}), conn, {...rest, now})
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countRoleModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    
    return mysql
        .execute(countRoleQuery({...rest, now}), conn, {...rest, now})
        .then(results => results[0].count)
}

const insertRoleModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()

    return mysql.execute(insertRoleQuery({...params, uuid, now}), conn, {...params, uuid, now})
        .then(res => res[1].map(({id, created, deleted, createdBy, deletedBy, ...rest}) => ({...rest})))
}

const modifyRoleModel = ({uuid, name, conn}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, name, now}

    return mysql
        .execute(modifyRoleQuery(params), conn, params)
        .then(res => {
            const deletedItem = res[1].find(item => item.deleted !== null);
  
            if (deletedItem) {
                throw error404()
            }
            return res[1].map(({id, created, deleted, createdBy, deletedBy, ...rest}) => ({...rest}))
        })
}

const softDeleteRoleModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') :dayjs.utc().format('YYYY-MM-DD HH:mm:ss') 
    const params = {uuid, deletedBy, deleted: deletedData}

    return mysql
        .execute(softDeleteRoleQuery(params), conn, params)
}

export {
    getRoleModel,
    countRoleModel,
    insertRoleModel,
    modifyRoleModel,
    softDeleteRoleModel
}