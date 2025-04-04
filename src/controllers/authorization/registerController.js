import { insertUserModel } from "../../models/authorization/userModel.js";
import { error400, error409, errorHandler } from "../../utils/errors.js";
import { sendResponseBadRequest, sendResponseConflict } from "../../utils/responses.js";
import { noResults } from "../../validators/result-validators.js";
import mysql from "../../adapters/mysql.js";
import bcrypt from "bcrypt";

const postRegisterController = (req, res, next, config) => {    
    const { user, password, email, fk_role} = req.body;
    
    if (!user || !password) {
        const err = error400();
        return sendResponseBadRequest(res, err);
    }
    
    if (!user.match(/^[a-zA-Z0-9]+$/)) {
        const err = error400();
        return sendResponseBadRequest(res, err);
    }
    
    const conn = mysql.start(config);
    
    return bcrypt
        .hash(password, config.saltRounds)
        .then(hashedPassword => {
            return insertUserModel({
                username: user,
                password: hashedPassword,
                email: email || null, 
                fk_role, 
                conn
            });
        })
        .then((response) => {
            if (noResults(response)) {
                const err = error409();
                return sendResponseConflict(res, err);
            }

            const result = {
                message: 'User registered successfully',
                user: {
                    username: user,
                    email: email || null,
                    role: fk_role || 'viewer'
                }
            }
            next(result);
        })
        .catch((err) => {
            const error = errorHandler(err, config.environment);
            return res.status(err.code).json(error);
        })
        .finally(() => {
            mysql.end(conn);
        });
}

export {
    postRegisterController
}