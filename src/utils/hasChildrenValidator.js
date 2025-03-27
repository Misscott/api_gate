import { sendUnprocessableEntityResponse } from './responses'

const hasChildrenValidator = (result, req, res, next, config) => {
	return result.length === 0
		? next(result)
		: sendUnprocessableEntityResponse(res, config.environment)
}
export { hasChildrenValidator }
