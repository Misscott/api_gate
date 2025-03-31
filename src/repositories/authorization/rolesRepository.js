import { pagination } from "../../utils/pagination.js";

/**
 * Generic select query that may or may not include counting rows
 * @param {Object} _pagination
 * @param {Object} count If true, query is of type SELECT COUNT
 * @param {Object} rest Rest of params involved on query
 * @returns {String} SELECT query
 */
const _roleSelectQuery = (_pagination = '') => 
    ({ count }) =>
      ({ uuid, name }) => {
        const uuidCondition = uuid ? 'AND uuid = :uuid ' : '';
        const nameCondition = name ? 'AND name = :name ' : '';
        return `
          SELECT
            ${count || `*`}  
          FROM
            mydb.roles as r
          WHERE
            r.created <= :now
          AND
            (r.created > :now OR r.deleted IS NULL)
          AND
            true
            ${uuidCondition}
            ${nameCondition}
        `;
      };
  

/**
 * Uses generic select query to return a simple query
 * @returns {String} simple select query
 */
const getRoleQuery = ({ limit, page, ...rest }) => 
  _roleSelectQuery(pagination({ limit, page }))({ count: false })(rest);

/**
 * Uses generic select query to return a select count type of query
 * @returns {String} SELECT COUNT(*) query
 */
const countRoleQuery = rest => 
  _roleSelectQuery()({ count: 'COUNT(*) AS count' })(rest);

/**
 * Insert query using parameters passed in request
 * @returns {String} INSERT query
 */
const insertRoleQuery = () => {
    return `
    INSERT INTO mydb.users (
      uuid,
      name,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      :name,
      :now,
      :createdBy
    );
    SELECT * FROM mydb.roles WHERE uuid = :uuid;
    `
};

/**
 * @param {Object} params All params involved in query to be modified in certain object matching uuid passed as req param
 * @returns {String} UPDATE query
 */
const modifyRoleQuery = ({ name }) => {
  const nameCondition = name ? 'name = :name, ' : '';

  return `
    UPDATE
      mydb.roles
    SET
      ${nameCondition}
      uuid = :uuid
    WHERE
      roles.uuid = :uuid;
    SELECT mydb.roles.*
    FROM mydb.roles
    WHERE roles.uuid = :uuid
  `;
};

/**
 * @returns {String} DELETE query
 */
const deleteRoleQuery = () => {
  return `
    DELETE FROM mydb.roles
    WHERE roles.uuid = :uuid
  `;
};

/**
 * 
 * @returns {String} SOFT DELETE query
 */
const softDeleteRoleQuery = () => {
    return `
    UPDATE
        mydb.roles
    SET
        deleted = :deleted, deletedby = :deletedBy
    WHERE
        roles.uuid = :uuid
    AND
        deleted is null`
}

export { 
  countRoleQuery,
  getRoleQuery,
  insertRoleQuery,
  modifyRoleQuery,
  deleteRoleQuery,
  softDeleteRoleQuery
};
