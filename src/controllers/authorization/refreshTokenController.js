import { getUserListModel } from "../../models/authorization/userModel.js"
import { sendResponseUnauthorized } from "../../utils/responses.js"
import { noResults } from "../../validators/result-validators.js"
import mysql from "../../adapters/mysql.js"
import { error401, errorHandler } from "../../utils/errors.js"
import { generateTokens } from "../../services/authService.js"
import dotenv from "dotenv"
dotenv.config();

const postRefreshTokenController = (req, res, next, config) => {
    const conn = mysql.start(config)
    const { user } = req.auth

    getUserListModel({ uuid: user })
        .then((response) => {
            if (noResults(response)) {
                const err = error401()
                const error = errorHandler(err, config.environment)
                return sendResponseUnauthorized(res, error)
            }

            // only include uuid and username in the response
            const user = response.map(({ id, password, createdBy, deleted, deletedBy, ...rest }) => rest)

            return getUserListModel({ uuid: user.uuid, conn })
                .then((response) => {
                    if (noResults(response)) {
                        const err = error401()
                        const error = errorHandler(err, config.environment)
                        return sendResponseUnauthorized(res, error)
                    }

                    const tokenPayload = {
                        uuid: response[0].uuid,
                        role: response[0].role
                    }
                    
                    const {token, refreshToken} = generateTokens(tokenPayload) 
                    //token application in frontend
                    next({token, refreshToken})
                })
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment)
            return res.status(error.code).json(error)
        })
        .finally(() => {
            mysql.end(conn)
        })
}

export { postRefreshTokenController }