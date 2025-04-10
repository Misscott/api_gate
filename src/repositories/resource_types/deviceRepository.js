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
        ({uuid, serial_number, model, brand, description, stock, createdBy, created}) => {
            const uuidCondition = uuid ? 'AND uuid = :uuid ' : ''
            const serial_numberCondition = serial_number ? 'AND serial_number = :serial_number' : ''
            const modelCondition = model ? 'AND model = :model ' : ''
            const brandCondition = brand ? 'AND brand = :brand' : ''
            const descriptionCondition = description ?'AND description = :description ' : ''
            const stockCondition = stock ? 'AND stock = :stock ' : ''
            const createdByCondition = createdBy ? 'AND createdBy = :createdBy ' : ''
            const createdCondition = created ? 'AND created = :created ' : ''
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
                    ${createdByCondition}
                    ${createdCondition}
                    ${_pagination}
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
const insertDeviceQuery = (description) =>{
    const descriptionCondition = description ? ':description ' : null
    console.log(descriptionCondition)
    return `
    INSERT INTO mydb.devices (
        uuid, 
        serial_number, 
        model, 
        brand, 
        description, 
        created,
        createdBy
    )
    VALUES (
        :uuid, 
        :serial_number,
        :model, 
        :brand, 
        ${descriptionCondition}, 
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

    return `
        UPDATE 
            mydb.devices
        SET 
        ${serial_numberCondition}
        ${modelCondition}
        ${brandCondition}
        ${descriptionCondition}
        uuid = :uuid
        WHERE 
            devices.uuid = :uuid
        AND
            devices.deleted IS NULL;
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
        mydb.devices as devices
    SET
        devices.deleted = :deleted, devices.deletedby = :deletedBy
    WHERE
        devices.uuid = :uuid
    AND
        devices.deleted is null`
}

export {countDeviceQuery, getDeviceQuery, insertDeviceQuery, modifyDeviceQuery, deleteDeviceQuery, softDeleteDeviceQuery}