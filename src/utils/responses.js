import { error422, errorHandler } from './errors.js'

const sendOkResponse = (result, req, res) => {
	res.status(200).json(result)
}
const sendCreatedResponse = (result, req, res) => {
	res.status(201).json(result)
}

const sendResponseNoContent = (result, req, res) => {
	res.status(204).json(result)
}

const sendResponseServerError = (res, err) => {
	res.status(500).json(err)
}

const sendResponseBadRequest = (res, err) => {
	res.status(400).json(err)
}

const sendResponseUnauthorized = (res, err) => {
	return res.status(401).json(err)
}

const sendResponseAccessDenied = (res, err) => {
	return res.status(403).json(err)
}

const sendResponseNotFound = (res, err) => {
	res.status(404).json(err)
}

const sendResponseUnprocessableEntity = (res, err) => {
	res.status(422).json(err)
}

const sendUnprocessableEntityResponse = (res, environment, err = error422()) => {
	const error = errorHandler(err, environment)
	res.status(422).json(error)
}

const sendLoginSuccessfullResponse = (result, req, res) => {
	res.status(201).json(result)
	console.warn(`User ${result.user._data.username} has logged in`)
}

export { sendLoginSuccessfullResponse, sendCreatedResponse, sendResponseAccessDenied, sendOkResponse, sendResponseBadRequest, sendResponseNoContent, sendResponseNotFound, sendResponseServerError, sendResponseUnauthorized, sendResponseUnprocessableEntity, sendUnprocessableEntityResponse }
