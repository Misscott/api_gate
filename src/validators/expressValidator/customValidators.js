import { check } from 'express-validator'

const varChar = (field, { max = 255 } = {}) => check(field).isString().trim().isLength({ min: 1, max }).withMessage(`|${field}| must be a string with a length between 1 and ${max}`)
const integer = field => check(field).isInt({min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER}).withMessage(`|${field}| must be an integer`)
const uuid = field => check(field).isUUID('all').withMessage(`|${field}| must be a valid UUID`)

export {
	integer,
	uuid,
	varChar,
}
