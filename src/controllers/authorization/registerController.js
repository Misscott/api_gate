import { insertUserModel } from "../../models/authorization/userModel.js";
import { error400, error409, errorHandler } from "../../utils/errors.js";
import { sendResponseBadRequest, sendResponseConflict } from "../../utils/responses.js";
import { noResults } from "../../validators/result-validators.js";
import mysql from "../../adapters/mysql.js";
import bcrypt from "bcrypt";

const postRegisterController = (req, res, next, config) => { 
    const { username, password, email, fk_role} = req.body
    if (!username || !password) {
        const err = error400();
        return sendResponseBadRequest(res, err);
    }
    
    const conn = mysql.start(config);
    
    return bcrypt
        .hash(password, config.saltRounds)
        .then(hashedPassword => {
            return insertUserModel({ conn, username, password: hashedPassword, email, fk_role }) 
        })
        .then((response) => {
            if (noResults(response)) {
                const err = error409();
                return sendResponseConflict(res, err);
            }

            const result = {
				_data: {
					message: 'User created',
					response
				}
			}
			next(result)
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            res.status(error.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

export {
    postRegisterController
}