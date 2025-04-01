import { sendResponseAccessDenied } from '../utils/responses.js';
import { checkPermission, getDataFromToken, generateAccessToken} from '../services/authService.js';
import { getRolesHasPermissionsModel } from '../models/authorization/roles_has_permissionsModel.js';
import mysql from '../adapters/mysql.js';
import { error404, errorHandler } from '../utils/errors.js';
import { noResults } from '../validators/result-validators.js';

const obtainToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            resolve(token);
        } else {
            sendResponseAccessDenied(res, { message: 'No authorization provided. Access token required' });
            reject(new Error('No authorization provided'));
        }
    });
};

const setToken = (result, req, res, next, config) => {
	const { user, role } = result._data
	const token = generateAccessToken({
		payload: { user, role },
		config
	})
	next({ user: { ...result, token } })
}

const authenticateToken = (req, res, next) => {
    obtainToken(req, res)
        .then((token) => getDataFromToken(token))
        .then((decoded) => {
            req.auth = decoded;
            next();
        })
        .catch((error) => {
            console.error('Error in authentication middleware:', error);
            sendResponseAccessDenied(res, { message: 'Access denied. Invalid token.' });
        });
};

const authorizePermission = (endpoint) => {
    return (req, res, next, config) => {
        obtainToken(req, res)
            .then((token) => getDataFromToken(token)) //extract user data from the token
            .then((decoded) => {
                const roleName = decoded.payload.role
                _getRolePermissionsByName(roleName, config)
                    .then((rolePermissions) => {
                        const action = req.method
                        //check if the user has the necessary permissions
                        return checkPermission(action, endpoint, rolePermissions)
                            .then(({ hasPermission }) => {
                                if (!hasPermission) {
                                    sendResponseAccessDenied(res, {
                                        message: `You don't have permission to ${action} on ${endpoint}`
                                    });
                                    throw new Error(`Permission denied for ${action} on ${endpoint}`);
                                }
                            
                                //attach user and role to the request object
                                //req.auth.user = user;
                                //req.auth.role = role;
                            
                                next(); 
                            })
                        })
            })
            .catch((error) => {
                console.error('Error in authorization middleware:', error);
                sendResponseAccessDenied(res, { message: 'Authorization error', error: error.message });
            });
    };
};

const _getRolePermissionsByName = (roleName, config) => {
    const conn = mysql.start(config)
    return getRolesHasPermissionsModel({ roleName, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error404()
                const error = errorHandler(err, config.environment)
                return sendResponseNotFound(res, error)
            }
            console.log(response)
            return response.map(({ permission_action, permission_endpoint }) => ({
                permission_action,
                permission_endpoint
            }))
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

export {
    authenticateToken,
    authorizePermission,
    setToken
};