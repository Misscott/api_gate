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
            const uuidCondition = uuid ? 'AND carts.uuid = :uuid ' : ''
            const user_uuidCondition = user_uuid ? 'AND carts.fk_user = (SELECT id FROM mydb.users WHERE uuid = :user_uuid)' : ''
            const statusCondition = status ? 'AND carts.state = :status ' : ''
            const maxTotalCondition = maxTotal ? 'AND carts.total <= :total ' : ''
            const totalCondition = total ? 'AND carts.total = :total ' : ''
            const minTotalCondition = minTotal ? 'AND carts.total >= :total ' : ''
            return `
                SELECT
                    ${count || `carts.*,
                        items.uuid AS cart_item_uuid,
                        items.quantity AS cart_item_quantity,
                        items.item_price AS item_price,
                        user_devices.uuid AS user_device_uuid,
                        devices.model as model,
                        devices.brand as brand,
                        devices.serial_number as serial_number,
                        devices.uuid as device_uuid,
                        user_devices.stock as stock,
                        user_devices.price as price,
                        sellers.uuid AS seller_uuid,
                        sellers.username AS seller_username`}
                FROM
                    mydb.carts as carts
                LEFT JOIN 
                    mydb.cart_items as items on items.fk_cart = carts.id
                LEFT JOIN 
                    mydb.users_has_devices as user_devices on items.fk_user_device = user_devices.id
                LEFT JOIN
                    mydb.devices as devices on user_devices.fk_device = devices.id
                LEFT JOIN 
                    mydb.users AS sellers ON items.fk_seller = sellers.id
                WHERE
                    carts.deleted IS NULL
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
            state,
            created,
            createdBy
        ) VALUES (
            :uuid,
            (SELECT id FROM mydb.users WHERE uuid = :user_uuid),
            :status,
            :now,
            :createdBy
        );
        SELECT carts.*, users.uuid as user_uuid, users.username as username
        FROM mydb.carts as carts
        LEFT JOIN mydb.users as users ON carts.fk_user = users.id
        WHERE
            carts.uuid = :uuid
            
    `
}

/**
 * Update query using parameters passed in request
 * @returns {String} UPDATE query
 */
const updateCartQuery = ({status, total, user_uuid}) => {
    const statusCondition = status ? 'state = :status,' : ''
    const totalCondition = total ? 'total = :total,' : ''
    const userUuidCondition = user_uuid? 'fk_user = (SELECT id from mydb.users WHERE uuid = :user_uuid),' : ''
    return `
        UPDATE mydb.carts
        SET
            ${statusCondition}
            ${totalCondition}
            ${userUuidCondition}
            uuid = :uuid
        WHERE
            uuid = :uuid;
        SELECT 
          carts.*,
          users.uuid AS user_uuid,
          users.username AS username,
          cart_items.uuid AS cart_item_uuid,
          cart_items.quantity AS cart_item_quantity,
          devices.uuid AS device_uuid,
          devices.serial_number,
          devices.brand,
          devices.model,
          devices.description,
          devices.image,
          users_has_devices.uuid AS user_device_uuid,
          users_has_devices.stock,
          users_has_devices.price,
          sellers.uuid AS seller_uuid,
          sellers.username AS seller_username
        FROM mydb.carts AS carts
        LEFT JOIN mydb.users AS users ON carts.fk_user = users.id
        LEFT JOIN mydb.cart_items AS cart_items ON cart_items.fk_cart = carts.id
        JOIN mydb.devices AS devices ON cart_items.fk_device = devices.id
        JOIN mydb.users_has_devices AS users_has_devices ON cart_items.fk_user_device = users_has_devices.id
        JOIN mydb.users AS sellers ON cart_items.fk_seller = sellers.id
        WHERE (cart_items.deleted IS NULL)
          AND (devices.deleted IS NULL)
          AND (users_has_devices.deleted IS NULL)
          AND (sellers.deleted IS NULL)
          AND carts.uuid = :uuid;
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