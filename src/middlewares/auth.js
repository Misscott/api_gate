import { sendResponseAccessDenied, sendResponseUnauthorized, sendResponseNotFound } from '../utils/responses.js';
import { checkPermission, getDataFromToken, generateTokens} from '../services/authService.js';
import { getRolesHasPermissionsModel } from '../models/authorization/roles_has_permissionsModel.js';
import { error403, error404, errorHandler } from '../utils/errors.js';
import { noResults } from '../validators/result-validators.js';
import mysql from '../adapters/mysql.js';

function conditionalAuthorize(path, fieldsToCheck = []) {
    return (req, res, next, config) => {
        const needsAuthorization = fieldsToCheck.some(field => req.body[field] !== undefined);

        if (needsAuthorization) {
            // if some of the fields is present, check auth
            return authenticateToken(req, res, next, config, err => {
                if (err) return next(err); //Invalid token
                authorizePermission(path)(req, res, next, config);
            }, config)
        }

        //continue without need for auth
        return next();
    };
}

/**
 * use conditional rule for required field for auth
 * @param {Array} rules 
 * example: 
 * [
 *  {
 *      field: 'status', condition: value => ['CANCELLED', 'COMPLETED', 'PENDING'].includes(value)
 *  },
 * ]
 */
function payloadConditionCheck(rules = []) {
    return (req, res, next, config) => {
        const failedRule = rules.find(({ field, condition }) => {
            const value = req.body[field];
            return !condition(value);
        });

        if (failedRule) {
            const { field, message = 'Forbidden' } = failedRule;
            const err = error403();
            const error = errorHandler(err, config);
            return res.status(error.code).json({ error: message, field });
        }

        next();
    };
}

/**
 * use conditional rule for required field for auth promise based
 * @param {Array} rules 
 * example: 
 * [
 *  {
 *      field: 'status', condition: value => ['CANCELLED', 'COMPLETED', 'PENDING'].includes(value)
 *  },
 * ]
 */
function payloadPromiseConditionCheck(rules = []) {
    return (req, res, next, config) => {
        //skip if there are no rules
        if (rules.length === 0) {
            return next();
        }

        rules.reduce((chain, rule) => {
            return chain.then(() => {
                const { field, condition, message = 'Forbidden' } = rule;
                
                return Promise.resolve()
                    .then(() => condition(req, field))
                    .then(isValid => {
                        if (!isValid) {
                            const err = error403();
                            const error = errorHandler(err, config);
                            
                            res.status(error.code).json({ 
                                error: message, 
                                field 
                            });
                            
                            return Promise.reject('Validation failed');
                        }
                    });
            });
        }, Promise.resolve())
        .then(() => {
            next();
        })
        .catch(err => {
            if (err !== 'Validation failed') {
                next(err);
            }
        });
    };
}

const obtainToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            resolve(token);
        } else {
            return sendResponseUnauthorized(res, { message: 'No authorization provided. Access token required' })
        }
    });
};

const setToken = (result, req, res, next, config) => {
	const { uuid, role } = result._data
    const payload = {role, user: uuid}
	const {accessToken, refreshToken} = generateTokens(payload)
	next({ user: { ...result, accessToken, refreshToken} })
}

const authenticateToken = (req, res, next, config) => {
    obtainToken(req, res)
        .then((token) => getDataFromToken(token))
        .then((decoded) => {
            req.auth = decoded;
            next();
        })
        .catch((error) => {
            const err = errorHandler(error, config.environment)
            res.status(err.code).json(err)
        });
};

const refreshAuthenticate = (req, res, next) => {
    const token = req.body.refreshToken
    getDataFromToken(token, 'refresh')
        .then((decoded) => {
            req.auth = decoded;
            next();
        })
        .catch((error) => {
            if (error.code === 'TOKEN_TYPE_MISMATCH') {
                return sendResponseForbidden(res, error);  // 403 Forbidden
            }
            return sendResponseUnauthorized(res, error);
        });
}

const authorizePermission = (endpoint) => {
    return (req, res, next, config) => {
        obtainToken(req, res)
            .then((token) => getDataFromToken(token)) //extract user data from the token
            .then((decoded) => {
                const roleName = decoded.role
                _getRolePermissionsByName(res, roleName, config)
                    .then((rolePermissions) => {
                        const action = req.method
                        //check if the user has the necessary permissions
                        return checkPermission(action, endpoint, rolePermissions, config)
                            .then(({ hasPermission }) => {
                                if (!hasPermission) {
                                    return sendResponseAccessDenied(res, {
                                        message: `Access denied. User does not have permission`
                                    });
                                }
                                req.auth.user = decoded.user
                                req.auth.role = roleName;
                            
                                next(); 
                            })
                        })
            })
            .catch((error) => {
                return sendResponseAccessDenied(res, error);
            });
    };
};

const _getRolePermissionsByName = (res, roleName, config) => {
    const conn = mysql.start(config)
    return getRolesHasPermissionsModel({ roleName, conn })
        .then((response) => {
            return response.map(({ permission_action, permission_endpoint }) => ({
                permission_action,
                permission_endpoint
            }))
        })
        .catch((err) =>{
            throw err
        })
        .finally(() => {
            mysql.end(conn)
        })
}

export {
    authenticateToken,
    authorizePermission,
    setToken,
    refreshAuthenticate,
    conditionalAuthorize,
    payloadConditionCheck,
    payloadPromiseConditionCheck
};