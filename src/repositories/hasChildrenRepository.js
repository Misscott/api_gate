const hasChildrenQuery = ({dbName, table1, fieldName1, table2, fieldName2}) => {
    const table2InSchema = `${dbName}.${table2}`
    const table1InSchema = `${dbName}.${table1}`
    const fieldName1NoQuotation = fieldName1.replace(/['"]/g, '');
    const fieldName2NoQuotation = fieldName2.replace(/['"]/g, '');
    return `
        SELECT *
        FROM ${table2InSchema}
        WHERE ${fieldName2NoQuotation} = 
        (SELECT ${fieldName1NoQuotation} FROM ${table1InSchema} WHERE uuid = :uuidTable1)
        AND deleted IS NULL
    `
}

const cascadeSoftDeleteQuery = ({dbName, tableName}) => {
    const tableInSchema = `${dbName}.${tableName}`
    return `
        UPDATE ${tableInSchema}
        SET deleted = :deleted
        WHERE uuid = :uuid
        AND deleted IS NULL
    `
}

export {
    hasChildrenQuery,
    cascadeSoftDeleteQuery
}