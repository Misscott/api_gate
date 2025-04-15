import { pagination } from '../../utils/pagination.js'

const _permissionsQuery = (_pagination = '') => ({count}) => ({uuid, action, route}) => {
    const uuidCondition = uuid ? 'AND uuid = :uuid ' : '';
    const actionCondition = action ? 'AND action = :action ' : '';
    const endpointCondition = route ? `AND fk_endpoint = (SELECT id from mydb.endpoints WHERE route LIKE CONCAT('%',:route))` : '';
    return `
      SELECT
        ${count || 
            `*`}
      FROM
        mydb.permissions as p
      LEFT JOIN
        mydb.endpoints as e ON p.fk_endpoint = e.id 
      WHERE
         e.created <= :now
        AND (e.deleted > :now OR e.deleted IS NULL)
      AND
        p.created <= :now
      AND
        (p.deleted > :now OR p.deleted IS NULL)
      AND
        true
        ${uuidCondition}
        ${actionCondition}
        ${endpointCondition}
        ${_pagination}
    `;
}

const getPermissionsQuery = ({ limit, page, ...rest }) =>
    _permissionsQuery(pagination({ limit, page }))({ count: false })(rest);
const countPermissionsQuery = rest => 
    _permissionsQuery()({ count: 'COUNT(*) AS count' })(rest);

const insertPermissionsQuery = (createdBy) => {
  const createdByCondition = createdBy ? ':createdBy' : null;
  return `
    INSERT INTO mydb.permissions (
      uuid,
      action,
      fk_endpoint,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      :action,
      (SELECT id FROM mydb.endpoints WHERE route = :route),
      :now,
      ${createdByCondition}
    );
    SELECT * FROM mydb.permissions WHERE uuid = :uuid;
  `
}

const modifyPermissionsQuery = (action, route) => {
  const actionCondition = action ? 'action = :action ,' : '';
  const endpointCondition = route ? 'fk_endpoint = (SELECT id from mydb.endpoints WHERE route = :route),' : '';
  return `
  UPDATE mydb.permissions AS permissions
  SET 
      ${actionCondition}
      ${endpointCondition}
      uuid = :uuid
  WHERE
      permissions.uuid = :uuid
  AND 
      permissions.deleted IS NULL;
  SELECT * FROM mydb.permissions WHERE uuid = :uuid;
  `
}

const softDeletePermissionsQuery = () => {
    return `
    UPDATE 
        mydb.permissions AS permissions
    SET 
        deleted = :now, deletedBy = :deletedBy
    WHERE
        permissions.uuid = :uuid
    AND 
        permissions.deleted IS NULL;
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