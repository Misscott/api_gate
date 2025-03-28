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
        ({uuidDevices, stock}) => {
            const conditionUuid = ' AND fk_user = (SELECT id FROM mydb.user WHERE uuid = :uuidUsers) '
	        const conditionUuidDevices = uuidDevices ? ' AND fk_device = (SELECT id FROM mydb.devices WHERE uuid = :uuidDevices) ' : ''
            const stockCondition = stock ? 'AND stock = :stock ' : ''
            return `
                SELECT
                    ${count || '*'}
                FROM
                    mydb.devices
                WHERE
                    true
                    ${stockCondition}
            `
}

/**
 * Uses generic select query to return a simple query
 * @returns {String} simple select query
 */
const getDeviceQuery = ({limit, page, ...rest}) => _deviceSelectQuery(pagination({limit, page}))({count: false})(rest)
/**
 * Uses generic select query to return a select count type of query
 * @returns {String} SELECT COUNT(*) query
 */
const countDeviceQuery = rest => _deviceSelectQuery()({count: 'COUNT(*) AS count'})(rest)

/**
 * Insert query using parameters passed in request
 * @returns {String} INSERT query
 */
const insertDeviceQuery = () =>{
    const descriptionCondition = description ?'AND description = :description ' : null
    return `
    INSERT INTO mydb.devices (
        uuid, 
        serial_number, 
        model, 
        brand, 
        description, 
        stock,
        fk_user,
        created,
        createdBy
    )
    VALUES (
        :uuid, 
        :serial_number,
        :model, 
        :brand, 
        ${descriptionCondition}, 
        :stock,
        :user,
        :now,
        :createdBy
    );

    SELECT * FROM mydb.devices WHERE uuid = :uuid;
    `
};

/**
 * @param {Object} params All params involved in query to be modified in certain object matching uuid passed as req param 
 * @returns {String} UPDATE query
 */
const modifyDeviceQuery = ({serial_number, model, brand, description, stock}) => {
    const serial_numberCondition = serial_number ? 'serial_number = :serial_number, ' : ''
    const modelCondition = model ? 'model = :model, ' : ''
    const brandCondition = brand ? 'brand = :brand, ' : ''
    const descriptionCondition = description ? 'description = :description, ' : ''
    const stockCondition = stock ? 'stock = :stock, ' : ''

    return `
        UPDATE 
            mydb.devices
        SET 
        ${serial_numberCondition}
        ${modelCondition}
        ${brandCondition}
        ${descriptionCondition}
        ${stockCondition}
        uuid = :uuid
        fk_user = :fk_user
        WHERE 
            devices.uuid = :uuid;
        SELECT mydb.devices.*
        FROM mydb.devices
        WHERE devices.uuid = :uuid
    `
}

/**
 * @returns {String} DELETE query
 */
const deleteDeviceQuery = () => {
    return `
        DELETE FROM mydb.devices
        WHERE devices.uuid = :uuid
    `
}

/**
 * 
 * @returns {String} SOFT DELETE query
 */
const softDeleteDeviceQuery = () => {
    return `
    UPDATE
        mydb.devices
    SET
        deleted = :deleted, deletedby = :deletedBy
    WHERE
        devices.uuid = :uuid
    AND
        deleted is null`
}

export {countDeviceQuery, getDeviceQuery, insertDeviceQuery, modifyDeviceQuery, deleteDeviceQuery}