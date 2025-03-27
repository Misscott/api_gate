import mysql from 'mysql2'

const mysqlAdapter = () => {
    const start = config => 
        mysql.createPool(
            Object.assign({}, config.db, {
                multipleStatements: true,
                waitForConnections: true,
                connectionLimit: 10,
                idleTimeout: 120000 //idle connections timeout, in milliseconds, the default value is 60000
            })
        )
    const end = conn => conn.end
    
    const execute = (query, pool, params) => {
        return new Promise((resolve, reject) => {
            if(!query || query.trim().length === 0) {
                reject(new Error('No query provided'))
            }
            else{
                pool.getConnection((err, conn) => {
                    if(err) {
                        reject(err)
                    }
                    else{
                        conn.config.queryFormat = function(query2, values) {
                            if(!values) return query2
                            return query2.replace(/:(\w+)/g,
								(txt, key) => {
									if (Object.prototype.hasOwnProperty.call(values, key)) {
										return this.escape(values[key])
									}
									return txt
								}
                            )
                        }

                        conn.query(query, params, (err, result) => {
                            if (err) {
								console.error('##### QUERY FAILED: #####')
								console.error(query)
								console.error('##### REASON: #####')
								console.error(err)
								reject(err)
							}
                            else{
                                resolve(result)
                            }
                            conn.destroy()
                        })
                    }
                })
            }
        })
    }

    const beginTransaction = conn =>
        new Promise((resolve, reject) => {
            conn.beginTransaction((err) => {
                if(err) {
                    reject(err)
                }
                resolve(conn)
            })
        })

    const commit = conn =>
        new Promise((resolve, reject) => {
            conn.commit((err) => {
                if(err) {
                    reject(err)
                }
                resolve(conn)
            })
        })    

    return {start, end, execute, beginTransaction, commit}    
}

export default mysqlAdapter()