import { pagination } from '../../utils/pagination.js'

const _permissionsQuery = (_pagination) => ({count}) => ({uuid, action, endpoint}) => {
    const uuidCondition = uuid ? 'AND uuid = :uuid ' : '';
    const actionCondition = action ? 'AND action = :action ' : '';
    const endpointCondition = endpoint ? 'AND fk_endpoint = (SELECT id from mydb.endpoints WHERE route = :endpoint)' : '';
    return `
      SELECT
        ${count || 
            `*`}
      FROM
        mydb.permissions as p
      LEFT JOIN
        mydb.endpoints as e ON p.fk_endpoint = e.id 
        AND e.created <= :now
        AND (e.deleted > :now OR e.deleted IS NULL)
        p.created <= :now
      AND
        (p.deleted > :now OR p.deleted IS NULL)
      AND
        true
        ${uuidCondition}
        ${nameCondition}
        ${actionCondition}
        ${endpointCondition}
        ${_pagination}
    `;
}

const getPermissionsQuery = ({ limit, page, ...rest }) =>
    _permissionsQuery(pagination({ limit, page }))({ count: false })(rest);
const countPermissionsQuery = rest => 
    _permissionsQuery()({ count: 'COUNT(*) AS count' })(rest);

const insertPermissionsQuery = () => {
    return `
    INSERT INTO mydb.permissions (
      uuid,
      name,
      action,
      fk_endpoint,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      :name,
      :action,
      (SELECT id FROM mydb.endpoints WHERE route = :endpoint),
      :now,
      :createdBy
    );
    SELECT * FROM mydb.permissions WHERE uuid = :uuid;
    `
}

const modifyPermissionsQuery = (action, endpoint) => {
  const actionCondition = action ? 'action = :action ' : '';
  const endpointCondition = endpoint ? 'fk_endpoint = (SELECT id from mydb.endpoints WHERE route = :endpoint)' : '';
  return `
  UPDATE mydb.permissions
  SET 
      ${actionCondition}
      ${endpointCondition}
  WHERE
      permissions.uuid = :uuid
  AND 
      permissions.deleted IS NULL    
  SELECT * FROM mydb.permissions WHERE uuid = :uuid;
  `
}

const softDeletePermissionsQuery = () => {
    return `
    UPDATE 
        mydb.permissions
    SET 
        deleted = :now, deletedBy = :deletedBy
    WHERE
        permissions.uuid = :uuid
    AND 
        permissions.deleted IS NULL    
    SELECT * FROM mydb.permissions WHERE uuid = :uuid;
    `
}

export {
    getPermissionsQuery,
    countPermissionsQuery,
    insertPermissionsQuery,
    modifyPermissionsQuery,
    softDeletePermissionsQuery
}