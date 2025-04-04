import { getUserListModel } from "../../models/authorization/userModel.js";
import { noResults } from "../../validators/result-validators.js";
import mysql from "../../adapters/mysql.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../../utils/errors.js";
import { sendResponseUnauthorized } from "../../utils/responses.js";
import { getRolesHasPermissionsModel } from "../../models/authorization/roles_has_permissionsModel.js";

const postLoginController = (req, res, next, config) => {
    const { username, password } = req.body;
    const conn = mysql.start(config);
    
    getUserListModel({ conn, loginUsername: username})
        .then((response) => {
            if (noResults(response)) {
                const error = errorHandler({code: 'UNAUTHORIZED'}, config.environment);
                return sendResponseUnauthorized(res, error);
            }

            return bcrypt
                .compare(password, response[0].password)
                .then((isMatch) => {
                    if (!isMatch) {
                        const error = errorHandler({code: 'UNAUTHORIZED'}, config.environment);
                        return sendResponseUnauthorized(res, error);
                    }
                    
                    const {uuid, username, email, role} = response[0];
                    const roleUuid = role
                    
                    //obtain role permissions
                    return _getRolePermissions(config, roleUuid, conn)
                        .then(rolePermissions => {
                            const roleData = {
                                name: response[0].role_name || 'viewer', 
                                roles_uuid: roleUuid
                            };
                            
                            const result = {
                                _data: {
                                    uuid,
                                    username,
                                    email,
                                    role,
                                    roleData: roleData,
                                    role_permissions: rolePermissions
                                },
                            };
                            next(result);
                        });
                });
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            res.status(error.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

const _getRolePermissions = (config, roleName, conn) => {
    return getRolesHasPermissionsModel({ roleName: roleName, conn })
        .then((response) => {
            if (noResults(response)) {
                return [] //if user has no role assigned/no permissions assigned to role, return empty array to allow log in
            }
            
            return response
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            return sendResponseUnauthorized(res, error);
        })
}

export {
    postLoginController
}