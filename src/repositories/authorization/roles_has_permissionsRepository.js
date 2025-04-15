import { pagination } from '../../utils/pagination.js'

const _rolesHasPermissionsQuery = (_pagination = '') => ({count}) => ({uuid, role_uuid, permission_uuid, roleName}) => {
    const uuidCondition = uuid ? 'AND r.uuid = :uuid' : '';
    const roleUuidCondition = role_uuid ? 'AND fk_role = (SELECT id from mydb.roles WHERE uuid = :role_uuid)' : '';
    const roleNameCondition = roleName ? 'AND fk_role = (SELECT id from mydb.roles WHERE name = :roleName)' : '';
    const permissionsUuidCondition = permission_uuid ? 'AND fk_permission = (SELECT id from mydb.permissions WHERE uuid = :permission_uuid)' : '';
    return `
      SELECT
        ${count || 
            `r.*, 
            r2.name as role_name, 
            r2.uuid as role_uuid, 
            p.action as permission_action, 
            p.uuid as permission_uuid, 
            p.fk_endpoint as permission_endpoint`}
      FROM
        mydb.roles_has_permissions as r
      JOIN 
        mydb.roles as r2 ON r.fk_role = r2.id 
        AND r2.created <= :now
        AND (r2.deleted > :now OR r2.deleted IS NULL)
      JOIN 
        mydb.permissions as p ON r.fk_permission = p.id
        AND p.created <= :now
        AND (p.deleted > :now OR p.deleted IS NULL)
      WHERE
        r.created <= :now
      AND
        (r.created > :now OR r.deleted IS NULL)
      AND
        true
        ${uuidCondition}
        ${permissionsUuidCondition}
        ${roleNameCondition}
        ${roleUuidCondition}
        ${_pagination}
    `;
    }

const getRolesHasPermissionsQuery = ({ limit, page, ...rest }) =>
    _rolesHasPermissionsQuery(pagination({ limit, page }))({ count: false })(rest);
const countRolesHasPermissionsQuery = rest =>
    _rolesHasPermissionsQuery()({ count: 'COUNT(*) AS count' })(rest);

const insertRolesHasPermissionsQuery = () => {
    return `
    INSERT INTO mydb.roles_has_permissions (
      uuid,
      fk_role,
      fk_permission,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      (SELECT id FROM mydb.roles WHERE uuid = :role_uuid),
      (SELECT id FROM mydb.permissions WHERE uuid = :permission_uuid),
      :now,
      :createdBy
    );
    SELECT permissions.*,
    permissions.uuid as permission_uuid,
    roles.uuid as role_uuid,
    roles.name as role_name
    FROM mydb.roles_has_permissions as rp
    LEFT JOIN mydb.permissions as permissions ON rp.fk_permission = permissions.id
    LEFT JOIN mydb.roles as roles ON rp.fk_role = roles.id
    WHERE rp.uuid = :uuid;
    `
}

const modifyRolesHasPermissionsQuery = (new_role_uuid, new_permission_uuid) => {
  const roleUuidCondition = new_role_uuid ? 'fk_role = (SELECT id from mydb.roles WHERE uuid = :new_role_uuid),' : '';
  const permissionUuidCondition = new_permission_uuid ? 'fk_permission = (SELECT id from mydb.permissions WHERE uuid = :new_permission_uuid),' : '';
  return `
    UPDATE 
        mydb.roles_has_permissions as roles_has_permissions
    SET 
        ${roleUuidCondition}
        ${permissionUuidCondition}
        uuid = :uuid
    WHERE
        roles_has_permissions.fk_role = (SELECT id from mydb.roles WHERE uuid = :role_uuid)
        AND roles_has_permissions.fk_permission = (SELECT id from mydb.permissions WHERE uuid = :permission_uuid)
    AND 
        roles_has_permissions.deleted IS NULL; 
    SELECT * FROM mydb.roles_has_permissions WHERE uuid = :uuid;
  `
}

const softDeleteRolesHasPermissionsQuery = (permission_uuid) => {
  const permissionUuidCondition = permission_uuid ? 'AND roles_has_permissions.fk_permission = (SELECT id from mydb.permissions WHERE uuid = :permission_uuid)' : '';
  return `
    UPDATE 
        mydb.roles_has_permissions as roles_has_permissions
    SET 
        deleted = :deleted, deletedBy = :deletedBy
    WHERE
        roles_has_permissions.fk_role = (SELECT id from mydb.roles WHERE uuid = :role_uuid)
        ${permissionUuidCondition}
    AND
        roles_has_permissions.deleted IS NULL    
  `
}

export{
    getRolesHasPermissionsQuery,
    insertRolesHasPermissionsQuery,
    countRolesHasPermissionsQuery,
    softDeleteRolesHasPermissionsQuery,
    modifyRolesHasPermissionsQuery
}