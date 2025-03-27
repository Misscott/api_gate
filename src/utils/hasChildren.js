import { hasChildrenModel } from '../models/hasChildrenModel'

const hasChildren = (req, res, next, config, { adapter, schema, table1, fieldNameTable1, uuidTable1, table2, fieldNameTable2 }) => {
	return new Promise((resolve) => {
		const conn = adapter.start(config)
		resolve(hasChildrenModel({ adapter, schema, table1, fieldNameTable1, uuidTable1, table2, fieldNameTable2 }, conn)
			.then((hasChildren) => {
				const result = hasChildren === undefined || hasChildren.length === 0 ? [] : { hasChildren }
				next(result)
				return result
			})
			.catch((err) => {
				throw (err.message)
			})
			.finally(() => {
				adapter.end(conn)
			}))
	})
}

export { hasChildren }
