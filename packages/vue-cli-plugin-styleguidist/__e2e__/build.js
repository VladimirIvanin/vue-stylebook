const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')
const { installWorkspacePlugin, setupStyleguideEnv } = require('./helpers')

const cwd = path.resolve(__dirname, '../../../test/cli-packages')

const fs = require('fs')

beforeAll(() => {
	if (!fs.existsSync(cwd)) {
		fs.mkdirSync(cwd)
	}
})

async function createAndInstall(name) {
	const project = await create(
		name,
		{ vueVersion: '3', plugins: { 'vue-cli-plugin-styleguidist': {} } },
		cwd,
		false
	)
	await installWorkspacePlugin(project)
	await setupStyleguideEnv(project)
	return project
}

test('simple build', async () => {
	const project = await createAndInstall(`build`)
	const { stdout } = await project.run('vue-cli-service styleguidist:build')
	expect(stdout).toMatch('Style guide published')
	expect(project.has('styleguide/index.html')).toBeTruthy()
})

test('change styleguideDir folder', async () => {
	const project = await createAndInstall(`build-config-dir`)
	const config = await project.read('styleguide.config.js')
	// add a styleguideDir configuration
	await project.write(
		'styleguide.config.js',
		config.replace(/(module\.exports = \{)/, "$1\n  styleguideDir: 'dist',")
	)
	await project.run('vue-cli-service styleguidist:build')
	expect(project.has('styleguide/index.html')).not.toBeTruthy()
	expect(project.has('dist/index.html')).toBeTruthy()
})
