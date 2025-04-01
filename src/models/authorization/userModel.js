import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import {
    countUserListQuery,
    getUserListQuery,
    insertUserQuery,
    modifyUserQuery,
    deleteUserQuery,
    softDeleteUserQuery
} from '../../repositories/authorization/userRepository.js'

const getUserListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(getUserListQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countUserListModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {...rest, now}
    return mysql
        .execute(countUserListQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const getUserByUuidModel = ({conn, uuid}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = {uuid, now}
    return mysql
        .execute(getUserListQuery(paramsToSearch), conn, paramsToSearch)
        .then(queryResult => queryResult.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const insertUserModel = ({conn, ...params}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    return mysql
        .execute(insertUserQuery({...params, uuid, now}), conn, {...params, uuid, now})
        .then(queryResult => queryResult[1].map(({id, password, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
        .catch(err => {
            reject(err)
        })
}

const modifyUserModel = ({conn, ...params}) => {
    return mysql
        .execute(modifyUserQuery(params), conn, params)
        .then(queryResult => queryResult[1].map(({id, password, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const softDeleteUserModel = ({uuid, deleted, deletedBy, conn}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc.format('YYYY-MM-DD HH:mm:ss')
    const params = {uuid, deletedBy, deleted: deletedData}

    return mysql
        .execute(softDeleteUserQuery(params), conn, params)
}

export{
    countUserListModel,
    getUserListModel,
    softDeleteUserModel,
    insertUserModel,
    modifyUserModel
}

