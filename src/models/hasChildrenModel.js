import { cascadeSoftDeleteQuery, hasChildrenQuery } from "../repositories/hasChildrenRepository.js";
import dayjs from "dayjs";

const hasChildrenModel = (conn, { adapter, dbName, table1, fieldName1, uuidTable1, table2, fieldName2 }) => {
    const params = {
        dbName,
        table1,
        fieldName1,
        uuidTable1,
        table2,
        fieldName2
    };
    
    return adapter.execute(hasChildrenQuery(params), conn, params);
};


const cascadeSoftDeleteModel = (conn, {adapter, dbName, tableName, uuid}, deleted) => {
    const deletedData = deleted ? dayjs.utc(deleted).format('YYYY-MM-DD HH:mm:ss') : dayjs.utc().format('YYYY-MM-DD HH:mm:ss')
    const params = {
        dbName, 
        tableName, 
        uuid, 
        deleted: deletedData}

    return adapter
    .execute(cascadeSoftDeleteQuery(params), conn, params)
}

export {
    hasChildrenModel,
    cascadeSoftDeleteModel
}