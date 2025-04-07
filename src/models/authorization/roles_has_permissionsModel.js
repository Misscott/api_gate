import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { 
    getRolesHasPermissionsQuery,
    countRolesHasPermissionsQuery,
    insertRolesHasPermissionsQuery,
    softDeleteRolesHasPermissionsQuery,
    modifyRolesHasPermissionsQuery
} from '../../repositories/authorization/roles_has_permissionsRepository.js'

const getRolesHasPermissionsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const paramsToSearch = { ...rest, now }

    return mysql    
        .execute(getRolesHasPermissionsQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results.map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countRolesHasPermissionsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const paramsToSearch = { ...rest, now }

    return mysql
        .execute(countRolesHasPermissionsQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results[0].count)
}

const insertRolesHasPermissionsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const uuid = uuidv4()
    const paramsToInsert = { ...rest, uuid, now }

    return mysql
        .execute(insertRolesHasPermissionsQuery(paramsToInsert), conn, paramsToInsert)
        .then(results => results[1].map(({id, uuid, fk_role, fk_permission, created, deleted, createdBy, deletedBy, ...rest}) => ({...rest})))
}

const modifyRolesHasPermissionsModel = ({conn, ...params}) => {
    return mysql
        .execute(modifyRolesHasPermissionsQuery(params), conn, params)
        .then(queryResult => {
            const deletedItem = queryResult[1].find(item => item.deleted !== null);
  
            if (deletedItem) {
                throw error404()
            }
            return queryResult[1].map(({id, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered)
        })
}

const softDeleteRolesHasPermissionsModel = ({conn, deleted, deletedBy, ...rest}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const params = { ...rest, deleted: deletedData, deletedBy }

	return mysql
		.execute(softDeleteRolesHasPermissionsQuery(params), conn, params)
}

export {
    getRolesHasPermissionsModel,
    countRolesHasPermissionsModel,
    insertRolesHasPermissionsModel,
    softDeleteRolesHasPermissionsModel,
    modifyRolesHasPermissionsModel
}