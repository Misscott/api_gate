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
        ({cart_uuid, device_uuid, seller_uuid, quantity, min_price}) => {
            const conditionUuidCart = cart_uuid? ' AND cart_items.fk_cart = (SELECT id FROM mydb.carts WHERE uuid = :cart_uuid) ' : ''
            const conditionUuidDevices = device_uuid ? ' AND cart_items.fk_device = (SELECT id FROM mydb.devices WHERE uuid = :device_uuid) ' : ''
            const conditionUuidUser = seller_uuid ? ' AND cart_items.fk_seller = (SELECT id FROM mydb.users WHERE uuid = :seller_uuid) ' : ''
            const quantityCondition = quantity ? 'AND cart_items.quantity = :quantity ' : ''
            const priceCondition = min_price ? 'AND users_has_devices.price >= :min_price ' : ''

            return `
                SELECT
                    ${count || `
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
                    ${priceCondition}
                    ${_pagination}
            `
}

const getCartItemsQuery = ({limit, page, ...rest}) => _cartItemsSelectQuery(pagination({limit, page}))({count: false})(rest)
const countCartItemsQuery = rest => _cartItemsSelectQuery()({count: 'COUNT(*) AS count'})(rest)

const insertCartItemsQuery = () => {
    return `
        INSERT INTO mydb.cart_items (
            uuid,
            fk_cart,
            fk_device,
            fk_seller,
            fk_user_device,
            quantity,
            created,
            createdBy
        ) VALUES (
            :uuid,
            (SELECT id FROM mydb.carts WHERE uuid = :cart_uuid),
            (SELECT id FROM mydb.devices WHERE id = (
                SELECT fk_device FROM mydb.users_has_devices WHERE uuid = :user_device_uuid
            )),
            (SELECT id FROM mydb.users WHERE id = (
                SELECT fk_user FROM mydb.users_has_devices WHERE uuid = :user_device_uuid
            )),
            (SELECT id FROM mydb.users_has_devices WHERE uuid = :user_device_uuid),
            :quantity,
            :now,
            :createdBy
        );

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
        JOIN mydb.cart_items AS cart_items ON cart_items.fk_cart = carts.id
        JOIN mydb.devices AS devices ON cart_items.fk_device = devices.id
        JOIN mydb.users_has_devices AS users_has_devices ON cart_items.fk_user_device = users_has_devices.id
        JOIN mydb.users AS sellers ON cart_items.fk_seller = sellers.id
        WHERE carts.created <= :now
          AND (carts.deleted > :now OR carts.deleted IS NULL)
          AND (cart_items.deleted IS NULL)
          AND (devices.deleted IS NULL)
          AND (users_has_devices.deleted IS NULL)
          AND (sellers.deleted IS NULL)
          AND carts.uuid = :cart_uuid;
    `
}

const updateCartItemsQuery = ({quantity}) => {
    const quantityCondition = quantity ? 'quantity = :quantity,' : ''
    return `
        UPDATE mydb.cart_items
        SET 
            ${quantityCondition}
            fk_cart = (SELECT id from mydb.carts where uuid = :cart_uuid)
        WHERE
            fk_cart = (SELECT id from mydb.carts where uuid = :cart_uuid)
        AND 
            fk_user_device = (SELECT id from mydb.users_has_devices where uuid = :user_device_uuid);
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
        JOIN mydb.cart_items AS cart_items ON cart_items.fk_cart = carts.id
        JOIN mydb.devices AS devices ON cart_items.fk_device = devices.id
        JOIN mydb.users_has_devices AS users_has_devices ON cart_items.fk_user_device = users_has_devices.id
        JOIN mydb.users AS sellers ON cart_items.fk_seller = sellers.id
        WHERE carts.created <= :now
          AND (carts.deleted > :now OR carts.deleted IS NULL)
          AND (cart_items.deleted IS NULL)
          AND (devices.deleted IS NULL)
          AND (users_has_devices.deleted IS NULL)
          AND (sellers.deleted IS NULL)
          AND carts.uuid = :cart_uuid;
    `
}

/**
 * Merges the cart items from two carts
 * @returns cart 1 with all updated items from both carts
 */
const mergeCartQuery = () => {
    return `
        UPDATE 
            mydb.cart_items ci1
        JOIN 
            mydb.cart_items ci2 ON ci1.product_id = ci2.product_id
        SET 
            ci1.quantity = ci1.quantity + ci2.quantity
        WHERE 
            ci1.fk_cart = (SELECT id from mydb.carts WHERE uuid = :to_cart_uuid) 
        AND 
            ci2.fk_cart = (SELECT id from mydb.carts WHERE uuid = :from_cart_uuid);
        UPDATE cart_items
        SET fk_cart = (SELECT id from mydb.carts WHERE uuid = :to_cart_uuid) 
        WHERE fk_cart = (SELECT id from mydb.carts WHERE uuid = :from_cart_uuid)
        AND fk_user_device NOT IN (
          SELECT fk_user_device FROM cart_items WHERE fk_cart = (SELECT id from mydb.carts WHERE uuid = :to_cart_uuid) 
        );
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
        JOIN mydb.cart_items AS cart_items ON cart_items.fk_cart = carts.id
        JOIN mydb.devices AS devices ON cart_items.fk_device = devices.id
        JOIN mydb.users_has_devices AS users_has_devices ON cart_items.fk_user_device = users_has_devices.id
        JOIN mydb.users AS sellers ON cart_items.fk_seller = sellers.id
        WHERE (cart_items.deleted IS NULL)
          AND (devices.deleted IS NULL)
          AND (users_has_devices.deleted IS NULL)
          AND (sellers.deleted IS NULL)
          AND carts.uuid = :to_cart_uuid;
    `
}

const deleteCartItemsQuery = () => {
    return `
        UPDATE mydb.cart_items
        SET deleted = :deleted,
            deletedBy = :deletedBy
        WHERE
            fk_cart = (SELECT id from mydb.carts where uuid = :cart_uuid)
        AND 
            fk_user_device = (SELECT id from mydb.user_has_devices where uuid = :user_device_uuid)
    `
}

export {
    getCartItemsQuery,
    countCartItemsQuery,
    insertCartItemsQuery,
    updateCartItemsQuery,
    deleteCartItemsQuery,
    mergeCartQuery
}