const errorHandler = (err, environment) => {
	// no stacktraces leaked to user
	const responseJson = {}
	console.error(err)
	switch (err.code) {
		case 'ER_DUP_ENTRY':
			responseJson.message = 'Conflict'
			responseJson.code = 409
			break
		case 'BAD_REQUEST':
			responseJson.message = 'Bad Request'
			responseJson.code = 400
			break
		case 'NOT_FOUND':
			responseJson.message = 'Not Found'
			responseJson.code = 404
			break
		case 'UNPROCESSABLE_ENTITY':
			responseJson.message = 'Unprocessable Entity'
			responseJson.code = 422
			break
		default:
			responseJson.message = 'Server Error'
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

const error404 = () => {
	const err = new Error('Not Found')
	err.code = 'NOT_FOUND'
	err.status = 404
	return err
}

const error422 = (message = 'Unprocessable Entity') => {
	const err = new Error(message)
	err.code = 'UNPROCESSABLE_ENTITY'
	err.status = 422
	return err
}

export { error404, error422, errorHandler }
