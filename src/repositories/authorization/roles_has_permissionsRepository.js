const _rolesHasPermissionsQuery = (_pagination) => ({count}) => ({uuid, role_uuid}) => {
    const uuidCondition = uuid ? 'AND uuid = :uuid ' : '';
    const roleUuidCondition = role_uuid ? 'AND role_uuid = :role_uuid ' : '';
    return `
      SELECT
        ${count || 
            `r.*, r2.name as role_name, r2.uuid as role_uuid`}
      FROM
        mydb.roles_has_permissions as r
        JOIN mydb.roles as r2 ON r.fk_role = r2.id
      WHERE
        r.created <= :now
      AND
        (r.created > :now OR r.deleted IS NULL)
      AND
        true
        ${uuidCondition}
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
      :fk_role,
      :fk_permission,
      :now,
      :createdBy
    );
    SELECT * FROM mydb.roles_has_permissions WHERE uuid = :uuid;
    `
}

const deleteRolesHasPermissionsQuery = () => {
    return `
    UPDATE 
        mydb.roles_has_permissions
    SET 
        deleted = :now, deletedBy = :deletedBy
    WHERE
        roles_has_permissions.fk_role = (SELECT id FROM mydb.roles WHERE uuid = :roleUuid)
    AND 
        roles_has_permissions.fk_permission = (SELECT id FROM mydb.permissions WHERE uuid = :permissionUuid)
    AND 
        roles_has_permissions.deleted IS NULL    
    SELECT * FROM mydb.roles_has_permissions WHERE uuid = :uuid;
    `
}


