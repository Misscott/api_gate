import { randomUUID as uuidv4 } from 'node:crypto'
import dayjs from 'dayjs'
import mysql from '../../adapters/mysql.js'
import { 
    getRolesHasPermissionsQuery,
    countRolesHasPermissionsQuery,
    insertRolesHasPermissionsQuery,
    softDeleteRolesHasPermissionsQuery
} from '../../repositories/authorization/roles_has_permissionsRepository.js'

const getRolesHasPermissionsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const paramsToSearch = { ...rest, now }

    return mysql    
        .execute(getRolesHasPermissionsQuery(paramsToSearch), conn, paramsToSearch)
        .then(results => results.map(({id, uuid, fk_role, fk_permission, created, deleted, createdBy, deletedBy, ...resultFiltered}) => resultFiltered))
}

const countRolesHasPermissionsModel = ({conn, ...rest}) => {
    const now = dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const paramsToSearch = { ...rest, now }

    return mysql
        .execute(countRolesHasPermissionsQuery(params), conn, paramsToSearch)
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

const softDeleteRolesHasPermissionsModel = ({conn, ...rest}) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
	const params = { ...rest, deleted: deletedData }

	return mysql
		.execute(softDeleteRolesHasPermissionsQuery(params), conn, params)
}

export {
    getRolesHasPermissionsModel,
    countRolesHasPermissionsModel,
    insertRolesHasPermissionsModel,
    softDeleteRolesHasPermissionsModel
}