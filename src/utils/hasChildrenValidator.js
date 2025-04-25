import { sendUnprocessableEntityResponse } from "./responses.js"

const hasChildrenValidator = (result, req, res, next, config) => {
	return result.length === 0
		? next()
		: sendUnprocessableEntityResponse(res, config.environment)
}
export { hasChildrenValidator }
