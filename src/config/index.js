import process from 'node:process'
import development from './development.js'
import production from './production.js'


const getConfig = () => {
	const env = process.env.NODE_ENV || 'development'

	const equivalences = {
		development,
		production
	}

    return equivalences[env];
}

export default getConfig();