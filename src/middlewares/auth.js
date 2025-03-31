import { sendResponseAccessDenied } from '../utils/responses';
import { checkPermission, getDataFromToken } from '../services/authService';

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

const authorizePermission = (resourceType) => {
    return (req, res, next) => {
        return new Promise((resolve, reject) => {
            if (!req.auth || !req.auth.user) {
                sendResponseAccessDenied(res, { message: 'Authentication required' });
                return reject(new Error('Authentication required'));
            }

            const userId = req.auth.user.id;
            const action = req.method; // GET, POST, PUT, DELETE

            checkPermission(userId, action, resourceType)
                .then(({ hasPermission, user, role }) => {
                    if (!hasPermission) {
                        sendResponseAccessDenied(res, { 
                            message: `You don't have permission to ${action} on ${resourceType}` 
                        });
                        return reject(new Error(`Permission denied for ${action} on ${resourceType}`));
                    }

                    req.auth.user = user;
                    req.auth.role = role;

                    resolve();
                    next();
                })
                .catch((error) => {
                    console.error('Error in authorization middleware:', error);
                    sendResponseAccessDenied(res, { message: 'Authorization error', error: error.message });
                    reject(error);
                });
        });
    };
};

export {
    authenticateToken,
    authorizePermission
};