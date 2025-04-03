const errorHandler = (err, environment, message) => {
	// no stacktraces leaked to user
	const responseJson = {}
	console.error(err)
	switch (err.code) {
		case 'ER_DUP_ENTRY':
			responseJson.message = message || 'Conflict'
			responseJson.code = 409
			break
		case 'BAD_REQUEST':
			responseJson.message = message || 'Bad Request'
			responseJson.code = 400
			break
		case 'UNAUTHORIZED':
			responseJson.message = message || 'Unauthorized'
			responseJson.code = 401
			break	
		case 'FORBIDDEN':
			responseJson.message = message || 'Forbidden'
			responseJson.code = 403
			break	
		case 'NOT_FOUND':
			responseJson.message = message || 'Not Found'
			responseJson.code = 404
			break
		case 'UNPROCESSABLE_ENTITY':
			responseJson.message = message || 'Unprocessable Entity'
			responseJson.code = 422
			break
		default:
			responseJson.message = message || 'Server Error'
			responseJson.code = 500
			break
	}

	// development error handler
	// will print stacktrace
	if (environment === 'development' || environment === 'test') {
		responseJson.error = err
	}
	return responseJson
}

const error400 = () => {
	const err = new Error('Bad Request')
	err.code = 'BAD_REQUEST'
	err.status = 400
}

const error401 = () => {
	const err = new Error('Unauthorized')
	err.code = 'UNAUTHORIZED'
	err.status = 401
	return err
}

const error403 = () => {
	const err = new Error('Forbidden')
	err.code = 'FORBIDDEN'
	err.status = 403
	return err
}

const error404 = () => {
	const err = new Error('Not Found')
	err.code = 'NOT_FOUND'
	err.status = 404
	return err
}

const error409 = () => {
	const err = new Error('Conflict')
	err.code = 'CONFLICT'
	err.status = 409
	return err
}

const error422 = (message = 'Unprocessable Entity') => {
	const err = new Error(message)
	err.code = 'UNPROCESSABLE_ENTITY'
	err.status = 422
	return err
}

export { error400, error401, error403, error404, error409, error422, errorHandler }
