import { cascadeSoftDeleteModel } from '../models/hasChildrenModel.js'
import { hasChildrenModel } from '../models/hasChildrenModel.js'
import { errorHandler } from './errors.js'

const hasChildren = (req, res, next, config, { adapter, dbName, table1, fieldName1, uuidTable1, table2, fieldName2 }) => {
	return new Promise((resolve) => {
	  const conn = adapter.start(config)
	  resolve(hasChildrenModel(conn, { adapter, dbName, table1, fieldName1, uuidTable1, table2, fieldName2 })
		.then((hasChildren) => {
		  const result = hasChildren === undefined || hasChildren.length === 0 ? [] : { hasChildren }
		  next(result)
		  return result
		})
		.catch((err) => {
		  const error = errorHandler(err, config.environment)
		  res.status(error.code).json(error);
		})
		.finally(() => {
		  adapter.end(conn)
		}))
	})
}
  
const checkAndSoftDeleteChildren = (req, res, next, config, {adapter, dbName, childTable, childField, parentTable, parentField, parentUuid}) => {
    hasChildren(req, res, (result) => {
        const children = result.hasChildren || [];
        if (!children.length) {
            next();
            return;
        }
        const conn = adapter.start(config);
        
        const deletePromises = children.map((child) => {
            return cascadeSoftDeleteModel(conn, {
                adapter,
                dbName,
                tableName: childTable, 
				uuid: child.uuid
            });
        });

		Promise.all(deletePromises)
			.then(() => 
				next())
			.catch(err => {
				const error = errorHandler(err, config.environment);
				res.status(error.code).json(error);
			})
			.finally(() => {
				adapter.end(conn);
			});
	}, config, { adapter, dbName, table1: parentTable, fieldName1: parentField, uuidTable1: parentUuid, table2: childTable, fieldName2: childField });
};

export{
	checkAndSoftDeleteChildren, hasChildren
}