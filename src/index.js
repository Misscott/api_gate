import file from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import process from 'node:process'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import express from 'express'
import config from './config/index.js'
import routes from './routes/index.js'
import { error404, errorHandler } from './utils/errors.js'
import { getRoutes } from './utils/links.js'

const app = express()
dayjs.extend(utc)
const { NODE_ENV } = process.env

/**
 * MIDDLEWARE------------------------------------------
 */
//parses incoming requests with JSON payloads
app.use(express.json({
    limit: process.env.APP_BODY_LIMIT || config.bodyLimit
}));

/**
 * BODY PARSER------------------------------------------
 */
//parses incoming requests with urlencoded payloads
//extended: false - parsing the URL-encoded data with the classic encoding algorithm 
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE')
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Client-Version')
	next()
})

// ROUTES --------------------------------------------------------------------------------
const r1 = routes(config)

const links1 = getRoutes({ prefix: '', routes: r1.stack })
const linkRoutes = { ...links1 }

app.use('/', r1)

// APPLICATION LAUNCHER ------------------------------------------------------------------
// 404 - Not found
app.use((req, res) => {
	const err = error404()
	const error = errorHandler({ err, code: 'NOT_FOUND' }, config.environment)
	res.status(error.code).json(error)
})

/*const httpsOptions = () => {
	return {
		key: file.readFileSync(path.join(__dirname, '..', 'key.pem')),
		cert: file.readFileSync(path.join(__dirname, '..', 'cert.pem'))
	}
}*/

const port = config.port || 3000

const server = (NODE_ENV === 'development' ? app : https.createServer(httpsOptions(), app)).listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening on port ${port}`)
})

export { app, linkRoutes, server }
