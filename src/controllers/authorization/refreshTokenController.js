import { getUserListModel } from "../../models/authorization/userModel"
import { sendResponseUnauthorized } from "../../utils/responses"
import { noResults } from "../../validators/result-validators"
import mysql from "../../adapters/mysql"
import { error401, errorHandler } from "../../utils/errors"
import { generateTokens } from "../../services/authService"
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
            const user = response.map(({ id, password, createdBy, deleted, deletedBy, createdBy, ...rest }) => rest)

            return getUserListModel({ uuid, conn })
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