const path = require('path')
const fs = require('fs')
const fsp = fs.promises

const pluginDir = path.resolve(__dirname, '..')

async function installWorkspacePlugin(project) {
	const pluginDest = path.join(project.dir, 'node_modules/vue-cli-plugin-styleguidist')
	await fsp.rm(pluginDest, { recursive: true, force: true })
	await fsp.cp(pluginDir, pluginDest, {
		recursive: true,
		filter: source => {
			const rel = path.relative(pluginDir, source)
			if (!rel) {
				return true
			}
			return !rel.startsWith('node_modules') && !rel.startsWith('__e2e__')
		}
	})
}

async function setupStyleguideEnv(project) {
	const setupCode = await fsp.readFile(
		path.resolve(__dirname, '../__samples__/setupEnv.js'),
		'utf8'
	)
	await project.write('setupEnv.js', setupCode)
	const styleguideConfig = await project.read('styleguide.config.js')
	await project.write('styleguide.config.js', `require('./setupEnv')\n${styleguideConfig}`)
}

module.exports = { installWorkspacePlugin, setupStyleguideEnv, pluginDir }
