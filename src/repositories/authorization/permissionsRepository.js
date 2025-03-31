const _permissionsQuery = (_pagination) => ({count}) => ({uuid, name, action, resource_type}) => {
    const uuidCondition = uuid ? 'AND uuid = :uuid ' : '';
    const nameCondition = name ? 'AND name = :name ' : '';
    const actionCondition = action ? 'AND action = :action ' : '';
    const resourceTypeCondition = resource_type ? 'AND resource_type = :resource_type ' : '';
    return `
      SELECT
        ${count || 
            `*`}
      FROM
        mydb.permissions as p
      WHERE
        p.created <= :now
      AND
        (p.created > :now OR p.deleted IS NULL)
      AND
        true
        ${uuidCondition}
        ${nameCondition}
        ${actionCondition}
        ${resourceTypeCondition}
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
      resource_type,
      created,
      createdBy
    )
    VALUES (
      :uuid,
      :name,
      :action,
      :resource_type,
      :now,
      :createdBy
    );
    SELECT * FROM mydb.permissions WHERE uuid = :uuid;
    `
}

const deletePermissionsQuery = () => {
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