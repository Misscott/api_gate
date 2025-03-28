import { pagination } from "../../utils/pagination.js";

/**
 * Generic select query that may or may not include counting rows
 * @param {Object} _pagination
 * @param {Object} count If true, query is of type SELECT COUNT
 * @param {Object} rest Rest of params involved on query
 * @returns {String} SELECT query
 */
const _userSelectQuery = (_pagination = '') => 
    ({ count }) =>
      ({ uuid, username, email, role }) => {
        const uuidCondition = uuid ? 'AND uuid = :uuid ' : '';
        const usernameCondition = username ? 'AND username = :username ' : '';
        const emailCondition = email ? 'AND email = :email ' : '';
        const roleCondition = role ? 'AND u.fk_role = :role ' : '';  
        return `
          SELECT
            ${count || `u.*, r.name AS role`}  
          FROM
            mydb.users as u
            LEFT JOIN mydb.roles as r ON u.fk_role = r.id
          WHERE
            u.created <= :now
          AND
            (u.created > :now OR u.deleted IS NULL)
          AND
            true
            ${uuidCondition}
            ${usernameCondition}
            ${emailCondition}
            ${roleCondition}
        `;
      };
  

/**
 * Uses generic select query to return a simple query
 * @returns {String} simple select query
 */
const getUserQuery = ({ limit, page, ...rest }) => 
  _userSelectQuery(pagination({ limit, page }))({ count: false })(rest);

/**
 * Uses generic select query to return a select count type of query
 * @returns {String} SELECT COUNT(*) query
 */
const countUserQuery = rest => 
  _userSelectQuery()({ count: 'COUNT(*) AS count' })(rest);

/**
 * Insert query using parameters passed in request
 * @returns {String} INSERT query
 */
const insertUserQuery = () => {
    const emailCondition = email ? ':email ' : null;
    return `
    INSERT INTO mydb.users (
      uuid,
      username,
      password,
      email,
      fk_role,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      :username,
      :password,
      ${emailCondition},
      :role
      :now,
      :createdBy
    );
    SELECT * FROM mydb.users WHERE uuid = :uuid;
    `
};

/**
 * @param {Object} params All params involved in query to be modified in certain object matching uuid passed as req param
 * @returns {String} UPDATE query
 */
const modifyUserQuery = ({ username, email, role }) => {
  const usernameCondition = username ? 'username = :username, ' : '';
  const passwordCondition = password ? 'password = :password, ' : '';
  const emailCondition = email ? 'email = :email, ' : '';
  const roleCondition = role ? 'fk_role = (SELECT id FROM mydb.roles WHERE name = :role) ' : '';

  return `
    UPDATE
      mydb.users
    SET
      ${usernameCondition}
      ${passwordCondition}
      ${emailCondition}
      ${roleCondition}
      uuid = :uuid
    WHERE
      users.uuid = :uuid;
    SELECT mydb.users.*
    FROM mydb.users
    WHERE users.uuid = :uuid
  `;
};

/**
 * @returns {String} DELETE query
 */
const deleteUserQuery = () => {
  return `
    DELETE FROM mydb.users
    WHERE users.uuid = :uuid
  `;
};

/**
 * 
 * @returns {String} SOFT DELETE query
 */
const softDeleteDeviceQuery = () => {
    return `
    UPDATE
        mydb.users
    SET
        deleted = :deleted, deletedby = :deletedBy
    WHERE
        users.uuid = :uuid
    AND
        deleted is null`
}

export { 
  countUserQuery, 
  getUserQuery, 
  insertUserQuery, 
  modifyUserQuery, 
  deleteUserQuery 
};
