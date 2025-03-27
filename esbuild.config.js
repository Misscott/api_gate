/*const path = require('node:path')
const process = require('node:process')
const esbuild = require('esbuild')
const packageJson = require('./package.json')

const green = '\x1B[32m'
const red = '\x1B[31m'
const blue = '\x1B[34m'
const reset = '\x1B[0m'

console.time(`${blue}⏱️  Build Time${reset}`)

esbuild.build({
	entryPoints: [path.resolve(__dirname, './src/index.js')],
	bundle: true,
	outfile: path.resolve(__dirname, './dist/index.js'),
	platform: 'node',
	target: 'node18',
	sourcemap: process.env.NODE_ENV === 'development',
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
	}
})
	.then(() => {
		console.log(
			`${green}✅ BUILD SUCCESSFUL!${reset}`,
			`(${packageJson.name}) ${red}v${packageJson.version}${reset}`
		)
		console.timeEnd(`${blue}⏱️  Build Time${reset}`)
	})
	.catch((err) => {
		console.timeEnd(`${blue}⏱️  Build Time${reset}`)
		console.error(`${red}❌ BUILD FAILED!${reset}`)
		console.error(`${red}${err.message || err}${reset}`)
		process.exit(1)
	})*/
