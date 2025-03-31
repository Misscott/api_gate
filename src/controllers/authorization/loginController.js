import { getUserListModel } from "../../models/authorization/userModel";
import { noResults } from "../../validators/result-validators";

const postLoginController = (req, res, next, config) => {
    const { username, password } = req.body;
    const conn = mysql.start(config);

    getUserListModel({ loginUsername: username, conn })
        .then((response) => {
            if (noResults(response)) {
                const err = error401;
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
                    

                    const result = {
                        _data: {
                            uuid,
                            username,
                            email,
                            role,
                        },
                    };

                    next(result);
                })
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
    postLoginController
}