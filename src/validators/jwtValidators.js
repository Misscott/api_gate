import { sendResponseAccessDenied } from "../utils/responses"

const validateKeyValuePairFromToken = ({ key, values, singleValidation }) => (req, res, next, config) => {
	const fieldValue = ((req.auth || {}).user || {})[key]
	if (fieldValue && values.includes(fieldValue)) {
		return singleValidation
			? next({ error: false })
			: true
	}

	return singleValidation
		? sendResponseAccessDenied({ res, config })
		: (req, res, env, next) => next({ error: true })
}

export { validateKeyValuePairFromToken }
