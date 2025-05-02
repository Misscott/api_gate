import { pagination } from "../../utils/pagination.js";

/**
 * Generic select query that may or may not include counting rows
 * @param {Object} _pagination 
 * @param {Object} count If true, query is of type SELECT COUNT
 * @param {Object} rest Rest of params involved on query 
 * @returns {String} SELECT query
 */
const _cartItemsSelectQuery = (_pagination = '') => 
    ({count}) => 
        ({cart_uuid, device_uuid, seller_uuid, quantity, user_device_uuid}) => {
            const conditionUuidCart = cart_uuid? ' AND fk_cart = (SELECT id FROM mydb.carts WHERE uuid = :cart_uuid) ' : ''
            const conditionUuidDevices = device_uuid ? ' AND fk_device = (SELECT id FROM mydb.devices WHERE uuid = :device_uuid) ' : ''
            const conditionUuidUser = seller_uuid ? ' AND fk_seller = (SELECT id FROM mydb.users WHERE uuid = :seller_uuid) ' : ''
            const quantityCondition = quantity ? 'AND quantity = :quantity ' : ''
            const userDeviceCondition = user_device_uuid ? 'AND fk_user_device = (SELECT id FROM mydb.users_has_devices WHERE uuid = :user_device_uuid) ' : ''

            return `
                SELECT
                    ${count || `
                        cart_items.*,
                        devices.uuid as device_uuid,
                        devices.serial_number as serial_number,
                        devices.brand as brand,
                        devices.model as model,
                        devices.description as description,
                        devices.image as image,
                        users_has_devices.uuid as user_device_uuid,
                        users_has_devices.stock as stock,
                        users_has_devices.price as price,
                        users.uuid as seller_uuid,
                        users.username as seller_username,
                        carts.uuid as cart_uuid
                        `}
                FROM
                    mydb.cart_items as cart_items
                JOIN mydb.carts as carts ON cart_items.fk_cart = carts.id
                JOIN mydb.devices as devices ON cart_items.fk_device = devices.id
                JOIN mydb.users as users ON cart_items.fk_seller = users.id
                JOIN mydb.users_has_devices as users_has_devices ON cart_items.fk_user_device = users_has_devices.id
                WHERE
                    cart_items.created <= :now
                AND
                    (cart_items.deleted > :now OR cart_items.deleted IS NULL)
                AND
                    true
                    ${conditionUuidCart}
                    ${conditionUuidDevices}
                    ${conditionUuidUser}
                    ${quantityCondition}
                    ${userDeviceCondition}
                    ${_pagination}
            `
}

const getCartItemsQuery = ({limit, page, ...rest}) => _cartItemsSelectQuery(pagination({limit, page}))({count: false})(rest)
const countCartItemsQuery = rest => _cartItemsSelectQuery()({count: 'COUNT(*) AS count'})(rest)

const insertCartItemsQuery = () => {
    return `
        INSERT INTO mydb.cart_items (
            fk_cart,
            fk_device,
            fk_seller,
            fk_user_device,
            quantity,
            created,
            createdBy
        ) VALUES (
            (SELECT id FROM mydb.carts WHERE uuid = :cart_uuid),
            (SELECT id FROM mydb.devices WHERE uuid = :device_uuid),
            (SELECT id FROM mydb.users WHERE uuid = :seller_uuid),
            (SELECT id FROM mydb.users_has_devices WHERE uuid = :user_device_uuid),
            :quantity,
            :now,
            :createdBy
        );
        SELECT cart_items.*, devices.uuid as device_uuid, devices.serial_number as serial_number, devices.brand as brand, devices.model as model, devices.description as description, devices.image as image, users_has_devices.uuid as user_device_uuid, users_has_devices.stock as stock, users_has_devices.price as price, users.uuid as seller_uuid, users.username as seller_username, carts.uuid as cart_uuid
        FROM mydb.cart_items as cart_items
        JOIN mydb.carts as carts ON cart_items.fk_cart = carts.id
        JOIN mydb.devices as devices ON cart_items.fk_device = devices.id   
        JOIN mydb.users as users ON cart_items.fk_seller = users.id
        JOIN mydb.users_has_devices as users_has_devices ON cart_items.fk_user_device = users_has_devices.id
        WHERE cart_items.uuid = :uuid
        AND cart_items.deleted IS NULL
        AND devices.deleted IS NULL
        AND users.deleted IS NULL
        AND users_has_devices.deleted IS NULL
        AND carts.deleted IS NULL
    `
}

const updateCartItemsQuery = ({quantity}) => {
    const quantityCondition = quantity ? 'AND quantity = :quantity ' : ''
    return `
        UPDATE mydb.cart_items
        SET 
            ${quantityCondition}
            uuid = :uuid
        WHERE
            uuid = :uuid;
        SELECT cart_items.*, devices.uuid as device_uuid, devices.serial_number as serial_number, devices.brand as brand, devices.model as model, devices.description as description, devices.image as image, users_has_devices.uuid as user_device_uuid, users_has_devices.stock as stock, users_has_devices.price as price, users.uuid as seller_uuid, users.username as seller_username, carts.uuid as cart_uuid
        FROM mydb.cart_items as cart_items
        JOIN mydb.carts as carts ON cart_items.fk_cart = carts.id
        JOIN mydb.devices as devices ON cart_items.fk_device = devices.id
        JOIN mydb.users as users ON cart_items.fk_seller = users.id
        JOIN mydb.users_has_devices as users_has_devices ON cart_items.fk_user_device = users_has_devices.id
        WHERE cart_items.uuid = :uuid
        AND cart_items.deleted IS NULL
        AND devices.deleted IS NULL
        AND users.deleted IS NULL
        AND users_has_devices.deleted IS NULL
        AND carts.deleted IS NULL
    `
}


const deleteCartItemsQuery = () => {
    return `
        UPDATE mydb.cart_items
        SET deleted = :deleted,
            deletedBy = :deletedBy
        WHERE uuid = :uuid
    `
}

export {
    getCartItemsQuery,
    countCartItemsQuery,
    insertCartItemsQuery,
    updateCartItemsQuery,
    deleteCartItemsQuery
}