import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mysql from '../adapters/mysql.js';
import { errorHandler } from '../utils/errors.js';
import { getEndpointsModel } from '../models/authorization/endpointsModel.js';
import { noResults } from '../validators/result-validators.js';
import { error404, error403 } from '../utils/errors.js';

dotenv.config();

/**
 * Decodes and verifies a JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<Object>} - Resolves with the decoded token payload.
*/
const getDataFromToken = (token) => {
  return new Promise((resolve, reject) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      err ? reject(err) : resolve(decoded);
    });
  });
};

/**
 * Generates a new JWT token.
 * @param {Object} payload - The payload to include in the token.
 * @returns {string} - The generated JWT token.
*/
const generateAccessToken = (payload) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_TIME = parseInt(process.env.JWT_TIME, 10);
  return jwt.sign(payload, JWT_SECRET, JWT_TIME ? { expiresIn: JWT_TIME } : {});
};

/**
 * Checks if a user has permission to perform an action on a resource.
 * @param {string} userId - The ID of the user.
 * @param {string} action - The action to check (e.g., GET, POST, PUT, DELETE).
 * @param {string} endpoin - The endpoint of the attack
 * @param {Array} userPermissions - The list of permissions assigned to the user.
 * @returns {Promise<Object>} - Resolves with an object containing permission details.
 */
const checkPermission = (action, endpoint, userPermissions, config) => {
  return _getEndpointByRoute(endpoint, config) 
    .then((endpointInfo) => {
      const hasPermission = userPermissions.some(
        (permission) =>
          permission.permission_action === action &&
          permission.permission_endpoint === endpointInfo.id // Comparar con el ID del endpoint
      );

      if (hasPermission) {
        return { hasPermission: true };
      }
      return { hasPermission: false };
    })
    .catch((error) => {
      const err = error403()
      return errorHandler(err, config.environment,`Authorization failed: ${error.message}`);
    });
};

const _getEndpointByRoute = (route, config) => {
  const conn = mysql.start(config)
  return getEndpointsModel({ route, conn }) 
    .then((endpointInformation) => {
      if (noResults(endpointInformation)) {
        const err = error404()
        errorHandler(err, config.environment)
      }

      return endpointInformation[0]
    })
    .catch((err) => {
      errorHandler(err, config.environment)
    })
    .finally(() => {
      mysql.end(conn)
    })
}

export {
  getDataFromToken,
  generateAccessToken,
  checkPermission,
};