import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { sendResponseAccessDenied } from '../utils/responses';

dotenv.config()

const obtainToken = (req) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    return token ? token : sendResponseAccessDenied(res, { message: 'No authorization provided. Access token required'});
}

const getDataFromToken = (token) => {
    return new Promise ((resolve, reject) => { 
        const JWT_SECRET = process.env.JWT_SECRET;
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
        err? reject(err) : resolve(decoded)
      });
    })
}

const authenticateToken = (req, res, next) => {
    const token = obtainToken(req)
    return getDataFromToken(token)
        .then((decoded) => {
            req.auth = decoded
            next()
        })
        .catch(() => sendResponseAccessDenied(res, { message: 'Access denied. Invalid token.'}))
  }

const generateAccessToken = ({payload}) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_TIME = parseInt(process.env.JWT_TIME, 10);

    return jwt.sign(payload, JWT_SECRET, JWT_TIME ? {expiresIn: JWT_TIME} : {});
}

const setToken = (result, req, res, next, config) => {
    const {user, roles} = result
    const token = generateSocketAccessToken({
        payload: {user, roles},
        config
    })
    next({_data: {...result, token}})
}

  export {authenticateToken, generateAccessToken, getDataFromToken, setToken}