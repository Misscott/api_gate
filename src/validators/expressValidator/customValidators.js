import { check } from 'express-validator'

const boolean = field => check(field).isBoolean().withMessage(`|${field}| must be a boolean`)
const varChar = (field, { max = 255 } = {}) => check(field).isString().trim().isLength({ min: 1, max }).withMessage(`|${field}| must be a string with a length between 1 and ${max}`)
const integer = field => check(field).isInt({min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER}).withMessage(`|${field}| must be an integer`)
const uuid = field => check(field).isUUID('all').withMessage(`|${field}| must be a valid UUID`)
const bigInt = field => check(field).isBigInt().withMessage(`|${field}| must be a valid BigInt`)
const decimal = (field, integerLength = 10, decimalLength = 2) =>
	check(field)
	  .custom(value => {
		const regex = new RegExp(`^\\d{1,${integerLength}}(\\.\\d{1,${decimalLength}})?$`);
		return regex.test(value);
	  })
	  .withMessage(`|${field}| must be a decimal with up to ${integerLength} digits and ${decimalLength} decimal places`); 

export {
	integer,
	uuid,
	varChar,
	bigInt,
	decimal,
	boolean
}
