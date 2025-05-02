import { pagination } from "../../utils/pagination.js";

/**
 * Generic select query that may or may not include counting rows
 * @param {Object} _pagination 
 * @param {Object} count If true, query is of type SELECT COUNT
 * @param {Object} rest Rest of params involved on query 
 * @returns {String} SELECT query
 */
const _cartSelectQuery = (_pagination = '') => 
    ({count}) => 
        ({uuid, user_uuid, status, maxTotal, total, minTotal}) => {
            const uuidCondition = uuid ? 'AND uuid = :uuid ' : ''
            const user_uuidCondition = user_uuid ? 'AND fk_user = (SELECT id FROM mydb.users WHERE uuid = :user_uuid) ' : ''
            const statusCondition = status ? 'AND status = :status ' : ''
            const maxTotalCondition = maxTotal ? 'AND total <= :total ' : ''
            const totalCondition = total ? 'AND total = :total ' : ''
            const minTotalCondition = minTotal ? 'AND total >= :total ' : ''
            return `
                SELECT
                    ${count || `*`}
                FROM
                    mydb.carts as carts
                WHERE
                    carts.created <= :now
                AND
                    (carts.deleted > :now OR carts.deleted IS NULL)
                AND
                    true
                    ${uuidCondition}
                    ${user_uuidCondition}
                    ${statusCondition}
                    ${maxTotalCondition}
                    ${totalCondition}
                    ${minTotalCondition}
                    ${_pagination}
            `
        }
        
/**
 * Uses generic select query to return a simple query
 * @returns {String} simple select query
 */
const getCartQuery = ({limit, page, ...rest}) => _cartSelectQuery(pagination({limit, page}))({count: false})(rest)

/**
 * Uses generic select query to return a select count type of query
 * @returns {String} SELECT COUNT(*) query
 */
const countCartQuery = rest => _cartSelectQuery()({count: 'COUNT(*) AS count'})(rest)

/**
 * Insert query using parameters passed in request
 * @returns {String} INSERT query
 */
const insertCartQuery = () => {
    return `
        INSERT INTO mydb.carts (
            uuid,
            fk_user,
            status,
            total,
            created,
            createdBy
        ) VALUES (
            :uuid,
            (SELECT id FROM mydb.users WHERE uuid = :user_uuid),
            :status,
            :total,
            :now,
            :createdBy
        );
        SELECT carts.*, users.uuid as user_uuid, users.username as username
        FROM mydb.carts as carts
        JOIN mydb.users as users ON carts.fk_user = users.id
        WHERE carts.uuid = :uuid
        AND deleted IS NULL
    `
}

/**
 * Update query using parameters passed in request
 * @returns {String} UPDATE query
 */
const updateCartQuery = ({status, total}) => {
    const statusCondition = status ? 'AND status = :status,' : ''
    const totalCondition = total ? 'AND total = :total,' : ''
    return `
        UPDATE mydb.carts
        SET
            ${statusCondition}
            ${totalCondition}
            uuid = :uuid
        WHERE
            uuid = :uuid;
        SELECT carts.*, users.uuid as user_uuid, users.username as username
        FROM mydb.carts as carts
        JOIN mydb.users as users ON carts.fk_user = users.id
        WHERE carts.uuid = :uuid
        AND deleted IS NULL
    `   
}

/**
 * Delete query using parameters passed in request
 * @returns {String} DELETE query
 */
const deleteCartQuery = () => {
    return `
        UPDATE mydb.carts as carts
        SET
            carts.deleted = :deleted, carts.deletedBy = :deletedBy
        WHERE
            uuid = :uuid
        AND 
            carts.deleted IS NULL
    `
}

export {
    getCartQuery,
    countCartQuery,
    insertCartQuery,
    updateCartQuery,
    deleteCartQuery
}