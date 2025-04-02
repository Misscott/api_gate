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
        ({uuid, serial_number, model, brand, description, stock}) => {
            const uuidCondition = uuid ? 'AND uuid = :uuid ' : ''
            const serial_numberCondition = serial_number ? 'AND serial_number = :serial_number' : ''
            const modelCondition = model ? 'AND model = :model ' : ''
            const brandCondition = brand ? 'AND brand = :brand' : ''
            const descriptionCondition = description ?'AND description = :description ' : ''
            const stockCondition = stock ? 'AND stock = :stock ' : ''
            return `
                SELECT
                    ${count || `*`}
                FROM
                    mydb.devices as devices
                WHERE
                    devices.created <= :now
                AND
                    (devices.deleted > :now OR devices.deleted IS NULL)
                AND
                    true
                    ${uuidCondition}
                    ${serial_numberCondition}
                    ${modelCondition}
                    ${brandCondition}
                    ${descriptionCondition}
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
const insertDeviceQuery = (userUuid) =>{
    const descriptionCondition = description ?'AND description = :description ' : null
    return `
    INSERT INTO mydb.devices (
        uuid, 
        serial_number, 
        model, 
        brand, 
        description, 
        stock,
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
const modifyDeviceQuery = ({user, serial_number, model, brand, description, stock}) => {
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

export {countDeviceQuery, getDeviceQuery, insertDeviceQuery, modifyDeviceQuery, deleteDeviceQuery, softDeleteDeviceQuery}