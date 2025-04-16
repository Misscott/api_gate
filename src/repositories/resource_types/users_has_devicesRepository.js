import {pagination} from "../../utils/pagination.js"

/**
 * Generic select query that may or may not include counting rows
 * @param {Object} _pagination 
 * @param {Object} count If true, query is of type SELECT COUNT
 * @param {Object} rest Rest of params involved on query 
 * @returns {String} SELECT query
 */
const _usersHasDevicesSelectQuery = (_pagination = '') => 
    ({count}) => 
        ({device_uuid, user_uuid, stock}) => {
            const conditionUuidUser = user_uuid? ' AND fk_user = (SELECT id FROM mydb.users WHERE uuid = :user_uuid) ' : ''
	        const conditionUuidDevices = device_uuid ? ' AND fk_device = (SELECT id FROM mydb.devices WHERE uuid = :device_uuid) ' : ''
            const stockCondition = stock ? 'AND stock = :stock ' : ''
            return `
                SELECT
                    ${count || 
                        `users_has_devices.*,
                        devices.uuid as device_uuid,
                        devices.serial_number as serial_number,
                        users.uuid as user_uuid,
                        users.username as username
                        `}
                FROM
                    mydb.users_has_devices as users_has_devices
                LEFT JOIN mydb.devices as devices ON users_has_devices.fk_device = devices.id
                LEFT JOIN mydb.users as users ON users.id = users_has_devices.fk_user
                WHERE
                    true
                    ${conditionUuidUser}
                    ${conditionUuidDevices}
                    ${stockCondition}
                AND users_has_devices.deleted IS NULL
                AND devices.deleted IS NULL
                AND users.deleted IS NULL
                    ${_pagination}
            `
}

/**
 * Uses generic select query to return a simple query
 * @returns {String} simple select query
 */
const getUsersHasDevicesQuery = ({limit, page, ...rest}) => _usersHasDevicesSelectQuery(pagination({limit, page}))({count: false})(rest)
/**
 * Uses generic select query to return a select count type of query
 * @returns {String} SELECT COUNT(*) query
 */
const countUsersHasDevicesQuery = rest => _usersHasDevicesSelectQuery()({count: 'COUNT(*) AS count'})(rest)

/**
 * Insert query using parameters passed in request
 * @returns {String} INSERT query
 */
const insertUsersHasDevicesQuery = () =>{
    return `
        INSERT INTO mydb.users_has_devices (
            uuid,
            fk_user,
            fk_device,
            stock,
            created,
            createdBy
        )
        VALUES (
            :uuid,
            (SELECT id FROM mydb.users WHERE uuid = :user_uuid),
            (SELECT id FROM mydb.devices WHERE uuid = :device_uuid),
            :stock,
            :now,
            :createdBy
        );
        SELECT * FROM mydb.users_has_devices 
        devices.uuid as device_uuid,
        users.uuid as user_uuid,
        users.username as username
        FROM mydb.users_has_devices as ud
        LEFT JOIN mydb.users as users ON ud.fk_user = users.id
        LEFT JOIN mydb.devices as devices ON ud.fk_device = devices.id
        WHERE ud.uuid = :uuid;
    `
};

/**
 * @param {Object} params All params involved in query to be modified in certain object matching uuid passed as req param 
 * @returns {String} UPDATE query
 */
const modifyUsersHasDevicesQuery = ({stock, new_user_uuid, new_device_uuid}) => {
    const stockCondition = stock ? 'stock = :stock ' : ''
    const userUuidCondition = new_user_uuid ? 'fk_user = (SELECT id from mydb.users WHERE uuid = :new_user_uuid),' : '';
    const deviceUuidCondition = new_device_uuid ? 'fk_device = (SELECT id from mydb.devices WHERE uuid = :new_device_uuid),' : '';
    return `
        UPDATE
            mydb.users_has_devices
        SET
            ${deviceUuidCondition}
            ${userUuidCondition}
            ${stockCondition}
        WHERE
            users_has_devices.fk_user = (SELECT id from mydb.users WHERE uuid = :user_uuid)
        AND
            users_has_devices.fk_device = (SELECT id from mydb.devices WHERE uuid = :device_uuid)
        AND
            deleted IS NULL;
        SELECT * FROM mydb.users_has_devices 
        devices.uuid as device_uuid,
        users.uuid as user_uuid,
        users.username as username
        FROM mydb.users_has_devices as ud
        LEFT JOIN mydb.users as users ON ud.fk_user = users.id
        LEFT JOIN mydb.devices as devices ON ud.fk_device = devices.id
        WHERE
            users_has_devices.fk_user = (SELECT id from mydb.users WHERE uuid = :new_user_uuid)
        AND
            users_has_devices.fk_device = (SELECT id from mydb.devices WHERE uuid = :new_device_uuid);  
    `
}

/**
 * @returns {String} DELETE query
 */
const deleteUsersHasDevicesQuery = (device_uuid) => {
    const deviceUuidCondition = device_uuid? 'AND users_has_devices.fk_device = (SELECT id from mydb.devices WHERE uuid = :device_uuid)': ''
    return `
        DELETE FROM
            mydb.users_has_devices
        WHERE
            users_has_devices.fk_user = (SELECT id from mydb.users WHERE uuid = :user_uuid)
            ${deviceUuidCondition}
        AND
            deleted IS NULL
    `
}

/**
 * Soft delete query using parameters passed in request
 * @returns {String} SOFT DELETE query
 */
const softDeleteUsersHasDevicesQuery = () => {
    return `
        UPDATE
            mydb.users_has_devices
        SET
            deleted = :deleted, deletedBy = :deletedBy
        WHERE
            users_has_devices.uuid = :uuid
        AND
            deleted IS NULL
    `
}

export {
    getUsersHasDevicesQuery,
    countUsersHasDevicesQuery,
    insertUsersHasDevicesQuery,
    modifyUsersHasDevicesQuery,
    deleteUsersHasDevicesQuery,
    softDeleteUsersHasDevicesQuery
}