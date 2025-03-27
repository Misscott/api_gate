/**
 * Sends a message as a response to inform user that server is working
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const indexController = (req, res, next) => {
    const result = {
		_data: {
			message: 'Server up!'
		}
	}

	next(result)
}

export { indexController }