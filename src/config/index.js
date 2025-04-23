import production from './production.js'
import development from './development.js'
import process from 'node:process'

const getConfig = () => {
	const env = process.env.NODE_ENV || 'development'

	const equivalences = {
		development,
		production
	}

    return equivalences[env];
}

export default getConfig();