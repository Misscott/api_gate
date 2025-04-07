/**
 * @fileoverview This file contains the route definitions for the user-related endpoints.
 */
import {Router} from 'express'             
import { getDeviceController, getDeviceByUuidController, postDeviceController, putDeviceController, deleteDeviceController, getDeviceBySerialNumberController, getDeviceByModelController, getDeviceByBrandController } from '../controllers/resource_types/deviceController.js'
import { getUserListController, getUserInfoController, postUserController, putUserController, softDeleteUserController } from '../controllers/authorization/userController.js'
import { getRoleController, getRoleInfoController, postRoleController, putRoleController, deleteRoleController } from '../controllers/authorization/rolesController.js'
import { getPermissionController, getPermissionByUuidController, postPermissionController, putPermissionController, softDeletePermissionController } from '../controllers/authorization/permissionsController.js'
import { indexController } from '../controllers/indexController.js'
import { postLoginController } from '../controllers/authorization/loginController.js'
import { addLinks } from '../utils/links.js'
import { linkRoutes } from '../index.js'
import {
    sendCreatedResponse,
	sendLoginSuccessfullResponse,
	sendOkResponse,
    sendResponseNoContent,
} from '../utils/responses.js'
import { bigInt, integer, uuid, varChar} from '../validators/expressValidator/customValidators.js'
import {payloadExpressValidator} from '../validators/expressValidator/payloadExpressValidator.js'
import { error422, errorHandler } from '../utils/errors.js'
import { authorizePermission, setToken, authenticateToken} from '../middlewares/auth.js'
import { postRegisterController } from '../controllers/authorization/registerController.js'
import { postRefreshTokenController } from '../controllers/authorization/refreshTokenController.js'
import { 
    getEndpointsByRouteController, 
    getEndpointsController,
    getEndpointsByUuidController,
    postEndpointsController,
    putEndpointsController,
    deleteEndpointsController,
    softDeleteEndpointsController
} from '../controllers/authorization/endpointsController.js'
import { 
    getRolesHasPermissionsController, 
    postRolesHasPermissionsController, 
    putRolesHasPermissionsController, 
    softDeleteRolesHasPermissionsController,
 } from '../controllers/authorization/roles_has_permissionsController.js'
import { 
    getUsersHasDevicesController,
    postUsersHasDevicesController, 
    putUsersHasDevicesController, 
    softDeleteUsersHasDevicesController,
 } from '../controllers/resource_types/usersHasDevicesController.js'
/**
 * @function default 
 * @param {Object} configuration based on environment
 * @returns {Router} all endpoint routes
 */
/**
 * @fileoverview This file defines the routes for the REST API, including endpoints for devices, users, roles, permissions, and login.
 * It uses Express.js to define and manage routes, and includes middleware for authentication, authorization, validation, and response handling.
 * 
 * @module routes/index
 * @requires express.Router
 * @requires controllers
 * @requires middlewares
 * @requires validators
 * 
 * @param {Object} config - Configuration object for the application.
 * @param {string} config.environment - The current environment (e.g., 'production', 'development').
 * @returns {Object} routes - The configured Express router with all defined routes.
 */
export default(config) => {
    /**
    * Express router to mount user related functions on.
    * @type {Object}
    * @const
    * @namespace deviceRouter
    */
    const routes = Router()
    const hasAddLinks = config.environment !== 'production'

    /**
    * Gets message from data object result from index controller to check if server is up.
    * Ideally, if server is working correctly it should return message
    * @name get/
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /
    * @returns {Device} 200 - The data object with message 
    * @returns {ErrorResponse} 404 - Data not found
    * @returns {ErrorResponse} 500 - Internal server error
    */
    routes.get(
        '/',
        (req, res, next) => indexController(req, res, next),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    // Device routes
    /**
    * Gets all the devices from database
    * @name get/devices
    * @function
    * @inner
    * @memberof deviceRouter
    * @route GET /devices
    * @group Devices - Operations about devices
    * @returns {Device} 200 - The devices object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 500 - Internal server error
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 403 - Forbidden
    * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.get(
        '/devices',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices')(req, res, next, config),
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @name post/devices
    * @function
    * @inner
    * @route POST /devices
    * @group Devices - Operations about devices
    * @memberof deviceRouter
    * @param {Device} req.body - The device object to create
    * @returns {SuccessResponse} 200 - Device created successfully/ Response OK
    * @returns {ErrorResponse} 400 - Bad request
    * @returns {ErrorResponse} 500 - Internal server error
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 403 - Forbidden
    * @returns {ErrorResponse} 401 - Unauthorized
    **/
    routes.post(
        '/devices',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('serial_number'),
            varChar('model'),
            varChar('brand'),
            varChar('description').optional({ nullable: true, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => {
            const { serial_number, model, brand, description, stock } = req.body;
            if(!req.body || (!serial_number || !model || !brand || typeof stock !== 'number')){
                const error = errorHandler(error422(), config.environment)
                return res.status(error.code).json(error)
            } 
            return postDeviceController(req, res, next, config)
        },
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @route GET /devices/{uuid}
    * @group Devices - Operations about devices
    * @name get/devices/:uuid
    * @function
    * @inner
    * @memberof deviceRouter
    * @param {string} uuid.path.required - The unique identifier for the device
    * @returns {Device} 200 - The device object
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 500 - Internal server error
    * @returns {ErrorResponse} 403 - Forbidden
    * @returns {ErrorResponse} 401 - Unauthorized
    */
    routes.get(
        '/devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getDeviceByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    )

    /**
    * @name put/devices/:uuid
    * @function
    * @inner
    * @memberof deviceRouter
    * @route PUT /devices/{uuid}
    * @group Devices - Operations about devices
    * @param {string} uuid.path.required - The unique identifier for the device
    * @param {Device} req.body - The device object to update
    * @returns {SuccessResponse} 201 - Device created successfully
    * @returns {ErrorResponse} 400 - Bad request
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 500 - Internal server error
    * @returns {ErrorResponse} 422 - Unprocessable entity
    * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('serial_number').optional({ nullable: false, values: 'falsy' }),
            varChar('model').optional({ nullable: false, values: 'falsy' }),
            varChar('brand').optional({ nullable: false, values: 'falsy' }),
            varChar('description').optional({ nullable: true, values: 'falsy' }),
            integer('stock').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putDeviceController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    )

    /**
    * @name DELETE/devices/:uuid
    * @function
    * @inner
    * @memberof deviceRouter
    * @route DELETE /devices/{uuid}
    * @group Devices - Operations about devices
    * @param {string} uuid.path.required - The unique identifier for the device
    * @returns {SuccessResponse} 204 - Device deleted successfully. No content
    * @returns {ErrorResponse} 404 - Device not found
    * @returns {ErrorResponse} 500 - Internal server error
    * @returns {ErrorResponse} 403 - Forbidden
    **/
    routes.delete(
        '/devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/devices/:uuid')(req, res, next, config),
        [   
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deleteDeviceController(req, res, next, config),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    )

    // User Routes
    /**
     * @name get/users
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /users
     * @group Users - Operations about users
     * @param {string} uuid.path.required - The unique identifier for the user
     * @param {string} username.path.required - The username of the user
     * @param {string} email.path.required - The email of the user
     * @returns {User} 200 - The user object
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * */
    routes.get(
        '/users',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('email').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserListController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name get/users/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /users/{uuid}
     * @group Users - Operations about users
     * @param {string} uuid.path.required - The unique identifier for the user
     * @param {string} username.path.required - The username of the user
     * @param {string} email.path.required - The email of the user
     * @returns {User} 200 - The user object
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     */
    routes.get(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserInfoController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/users
     * @function
     * @inner
     * @memberof deviceRouter
     * @route POST /users
     * @group Users - Operations about users
     * @param {string} username.path.required - The username of the user
     * @param {string} password.path.required - The password of the user
     * @param {string} email.path.required - The email of the user
     * @param {string} fk_role.path.required - The role of the user
     * @param {string} uuid.path.required - The unique identifier for the user
     * @returns {SuccessResponse} 200 - User created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     */
    routes.post(
        '/users',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users')(req, res, next, config),
        [
            varChar('username'),
            varChar('password'),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            varChar('fk_role').optional({ nullable: false, values: 'falsy' })

        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/users/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route PUT /users/{uuid}
     * @group Users - Operations about users
     * @param {string} uuid.path.required - The unique identifier for the user
     * @param {string} username.path.required - The username of the user
     * @param {string} email.path.required - The email of the user
     * @param {string} fk_role.path.required - The role of the user
     * @param {string} password.path.required - The password of the user
     * @returns {SuccessResponse} 200 - User updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     */
    routes.put(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('username').optional({ nullable: false, values: 'falsy' }),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name delete/users/:uuid 
     * @function 
     * @inner
     * @memberof deviceRouter
     * @route DELETE /users/{uuid}
     * @group Users - Operations about users
     * @param {string} uuid.path.required - The unique identifier for the user
     * @returns {SuccessResponse} 204 - User deleted successfully. No content
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.delete(
        '/users/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteUserController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    /**
        * @name GET/roles
        * @function
        * @inner
        * @memberof deviceRouter
        * @route GET /roles
        * @group Roles - Operations about roles
        * @param {string} uuid.path.required - The unique identifier for the role
        * @param {string} name.path.required - The name of the role
        * @returns {SuccessResponse} 200 - The role object
        * @returns {ErrorResponse} 404 - Role not found
        * @returns {ErrorResponse} 422 - Unprocessable entity
        * @returns {ErrorResponse} 500 - Internal server error
        * @returns {ErrorResponse} 403 - Forbidden
        * @returns {ErrorResponse} 401 - Unauthorized
        * @returns {ErrorResponse} 400 - Bad request
     */
    routes.get(
        '/roles',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles')(req, res, next, config),
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/roles/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /roles/{uuid}
     * @group Roles - Operations about roles
     * @param {string} uuid.path.required - The unique identifier for the role
     * @param {string} name.path.required - The name of the role
     * @returns {SuccessResponse} 200 - The role object
     * @returns {ErrorResponse} 404 - Role not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 400 - Bad request
     */
    routes.get(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRoleInfoController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/roles
     * @function
     * @inner
     * @memberof deviceRouter
     * @route POST /roles
     * @group Roles - Operations about roles
     * @param {string} name.path.required - The name of the role
     * @param {string} uuid.path.required - The unique identifier for the role
     * @returns {SuccessResponse} 200 - Role created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Role not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     */
    routes.post(
        '/roles',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles')(req, res, next, config),
        [
            varChar('name')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/roles/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route PUT /roles/{uuid}
     * @group Roles - Operations about roles
     * @param {string} uuid.path.required - The unique identifier for the role
     * @param {string} name.path.required - The name of the role
     * @param {string} fk_permission.path.required - The permission of the role
     * @returns {SuccessResponse} 200 - Role updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Role not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     */
    routes.put(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/roles/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route DELETE /roles/{uuid}
     * @group Roles - Operations about roles
     * @param {string} uuid.path.required - The unique identifier for the role
     * @param {string} name.path.required - The name of the role
     * @returns {SuccessResponse} 204 - Role deleted successfully. No content
     * @returns {ErrorResponse} 404 - Role not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 400 - Bad request
     */
    routes.delete(
        '/roles/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => deleteRoleController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Permission Routes
    /**
     * @name GET/permissions
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /permissions
     * @group Permissions - Operations about permissions
     * @param {string} uuid.path.required - The unique identifier for the permission
     * @param {string} name.path.required - The name of the permission
     * @returns {SuccessResponse} 200 - The permission object
     * @returns {ErrorResponse} 404 - Permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * */
    routes.get(
        '/permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /permissions/{uuid}
     * @group Permissions - Operations about permissions
     * @param {string} uuid.path.required - The unique identifier for the permission
     * @param {string} name.path.required - The name of the permission
     * @returns {SuccessResponse} 200 - The permission object
     * @returns {ErrorResponse} 404 - Permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * */
    routes.get(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getPermissionByUuidController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions')(req, res, next, config),
        [
            varChar('name')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/permissions/:uuid 
     * @function
     * @inner
     * @memberof deviceRouter
     * @route PUT /permissions/{uuid}
     * @group Permissions - Operations about permissions
     * @param {string} uuid.path.required - The unique identifier for the permission
     * @param {string} action.path - The name of the action/http method for the request
     * @param {string} endpoint.path - The name of the permission
     * @returns {SuccessResponse} 200 - Permission updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * */
    routes.put(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('action').optional({ nullable: false, values: 'falsy' }),
            varChar('endpoint').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route DELETE /permissions/{uuid}
     * @group Permissions - Operations about permissions
     * @param {string} uuid.path.required - The unique identifier for the permission
     * @param {string} name.path.required - The name of the permission
     * @returns {SuccessResponse} 200 - Permission deleted successfully
     * @returns {ErrorResponse} 404 - Permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.delete(
        '/permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid')

        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeletePermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Roles Permissions Routes
    /**
     * @name GET/roles_permissions
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /roles_permissions
     * @group User Permissions - Operations about user permissions
     * @param {string} uuid.path.required - The unique identifier for the user permission
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - The role permission object
     * @returns {ErrorResponse} 404 - User permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.get(
        '/roles_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name GET/roles_permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route GET /roles_permissions/{uuid}
     * @group User Permissions - Operations about user permissions
     * @param {string} uuid.path.required - The unique identifier for the user permission
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - The role permission object
     * @returns {ErrorResponse} 404 - Role permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.get(
        '/roles_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUserPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    /**
     * @name POST/roles_permissions
     * @function
     * @inner
     * @memberof deviceRouter
     * @route POST /roles_permissions
     * @group Role Permissions - Operations about user permissions
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - User permission created successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - Role permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/roles_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_permissions')(req, res, next, config),
        [
            uuid('fk_user'),
            uuid('fk_permission')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postUserPermissionController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name PUT/roles_permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route PUT /roles_permissions/{uuid}
     * @group User Permissions - Operations about user permissions
     * @param {string} uuid.path.required - The unique identifier for the user permission
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - User permission updated successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.put(
        '/roles_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    /**
     * @name DELETE/user_permissions/:uuid
     * @function
     * @inner
     * @memberof deviceRouter
     * @route DELETE /user_permissions/{uuid}
     * @group User Permissions - Operations about user permissions
     * @param {string} uuid.path.required - The unique identifier for the user permission
     * @param {string} fk_user.path.required - The unique identifier for the user
     * @param {string} fk_permission.path.required - The unique identifier for the permission
     * @returns {SuccessResponse} 200 - User permission deleted successfully
     * @returns {ErrorResponse} 404 - User permission not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
     * @returns {ErrorResponse} 401 - Unauthorized
     * @returns {ErrorResponse} 400 - Bad request
     */
    routes.delete(
        '/roles_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    //Endpoints
    routes.get(
        '/endpoints',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            varChar('route').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.get(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('name').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/endpoints',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints')(req, res, next, config),
        [
            varChar('route')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            varChar('route').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.delete(
        '/endpoints/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/endpoints/:uuid')(req, res, next, config),
        [
            uuid('uuid')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteEndpointsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    //roles_has_permissions routes
    routes.get(
        '/roles_has_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.get(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/roles_has_permissions',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions')(req, res, next, config),
        [
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid'),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.delete(
        '/roles_has_permissions/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/roles_has_permissions/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_role').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_permission').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteRolesHasPermissionsController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    //users_has_devices routes
    routes.get(
        '/users_has_devices',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users_has_devices')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_device').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUsersHasDevicesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.get(
        '/users_has_devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users_has_devices/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_device').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => getUsersHasDevicesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendOkResponse(result, req, res)
    );

    routes.post(
        '/users_has_devices',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users_has_devices')(req, res, next, config),
        [
            uuid('fk_user'),
            uuid('fk_device')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postUsersHasDevicesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.put(
        '/users_has_devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users_has_devices/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_device').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => putUsersHasDevicesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    routes.delete(
        '/users_has_devices/:uuid',
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => authorizePermission('/users_has_devices/:uuid')(req, res, next, config),
        [
            uuid('uuid').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_user').optional({ nullable: false, values: 'falsy' }),
            uuid('fk_device').optional({ nullable: false, values: 'falsy' })
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => softDeleteUsersHasDevicesController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendResponseNoContent(result, req, res)
    );

    // Login Endpoint

    /**
     * @name POST/login
     * @function
     * @inner
     * @memberof deviceRouter
     * @route POST /login
     * @group Login - Operations about login
     * @param {string} username.path.required - The username of the user
     * @param {string} password.path.required - The password of the user
     * @returns {SuccessResponse} 200 - User logged in successfully
     * @returns {ErrorResponse} 400 - Bad request
     * @returns {ErrorResponse} 404 - User not found
     * @returns {ErrorResponse} 422 - Unprocessable entity
     * @returns {ErrorResponse} 500 - Internal server error
     * @returns {ErrorResponse} 403 - Forbidden
    */
    routes.post(
        '/login',
        [
            varChar('username'),
            varChar('password')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postLoginController(req, res, next, config),
        (result, req, res, next) => setToken(result, req, res, next),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendLoginSuccessfullResponse(result, req, res)
    );

    routes.post(
        '/refresh_token', //header contains refresh_token
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => authenticateToken(req, res, next, config),
        (req, res, next) => postRefreshTokenController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendLoginSuccessfullResponse(result, req, res)
    );

    routes.post(
        '/signin',
        [
            varChar('username'),
            varChar('password'),
            varChar('email').optional({ nullable: true, values: 'falsy' }),
            varChar('fk_role')
        ],
        (req, res, next) => payloadExpressValidator(req, res, next, config),
        (req, res, next) => postRegisterController(req, res, next, config),
        (result, req, res, next) => addLinks(result, req, res, next, hasAddLinks, linkRoutes),
        (result, req, res, _) => sendCreatedResponse(result, req, res)
    );

    return routes;
}