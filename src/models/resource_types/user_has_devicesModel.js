import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { 
    getUsersHasDevicesQuery,
    countUsersHasDevicesQuery,
    insertUsersHasDevicesQuery,
    modifyUsersHasDevicesQuery,
    softDeleteUsersHasDevicesQuery,
    deleteUsersHasDevicesQuery
} from '../../repositories/resource_types/users_has_devicesRepository.js'

const getUsersHasDevicesModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = { ...rest, now }

    return mysql    
        .execute(getUsersHasDevicesQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countUsersHasDevicesModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const paramsToSearch = { ...rest, now }

    return mysql
        .execute(countUsersHasDevicesQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertUsersHasDevicesModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    const paramsToInsert = { ...rest, uuid, now }

    return mysql
        .execute(insertUsersHasDevicesQuery(paramsToInsert), conn, paramsToInsert)
        .then(results => results[1].map(({id, uuid, fk_user, fk_device, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const modifyUsersHasDevicesModel = ({conn, ...rest}) => {
    const params = { ...rest }
    return mysql
        .execute(modifyUsersHasDevicesQuery(params), conn, params)
        .then(results => {
            const deletedItem = results[1].find(item => item.deleted !== null);
  
            if (deletedItem) {
                throw error404()
            }
            results[1].map(({id, uuid, fk_user, fk_device, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const softDeleteUsersHasDevicesModel = ({conn, deleted, deletedBy, ...rest}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = { ...rest, deleted: deletedData, deletedBy }

    return mysql
        .execute(softDeleteUsersHasDevicesQuery(params), conn, params)
}

export {
    getUsersHasDevicesModel,
    countUsersHasDevicesModel,
    insertUsersHasDevicesModel,
    modifyUsersHasDevicesModel,
    softDeleteUsersHasDevicesModel
}