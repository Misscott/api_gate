import {pagination} from "../../utils/pagination.js"

/**
 * Generic select query that may or may not include counting rows
 * @param {Object} _pagination 
 * @param {Object} count If true, query is of type SELECT COUNT
 * @param {Object} rest Rest of params involved on query 
 * @returns {String} SELECT query
 */
const _deviceSelectQuery = (_pagination = '') => 
    ({count}) => 
        () => {
            return `
                SELECT
                    ${count || `
                    devices.uuid AS device_uuid,
                    devices.model AS model,
                    devices.serial_number AS serial_number,
                    devices.brand AS brand,
                    ud.stock AS stock,
                    u.username AS owner`}
                FROM
                    mydb.devices AS devices
                JOIN 
                    mydb.users_has_devices AS ud
                    ON devices.id = ud.fk_device
                JOIN
                    mydb.users AS u
                    ON ud.fk_user = u.id
                JOIN
                    mydb.roles AS r
                    ON u.fk_role = r.id
                WHERE
                    devices.deleted IS NULL
                    AND ud.stock > 0
                    AND r.name = 'admin'

                `;

}   

/**
 * Uses generic select query to return a simple query
 * @returns {String} simple select query
 */
const getAvailableDevicesQuery = ({limit, page, ...rest}= {}) => _deviceSelectQuery(pagination({limit, page}))({count: false})(rest)
/**
 * Uses generic select query to return a select count type of query
 * @returns {String} SELECT COUNT(*) query
 */
const countAvailableDevicesQuery = rest => _deviceSelectQuery()({count: 'COUNT(*) AS count'})(rest)

export{
    getAvailableDevicesQuery,
    countAvailableDevicesQuery
}