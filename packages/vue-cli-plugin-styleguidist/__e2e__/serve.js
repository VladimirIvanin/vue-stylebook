const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')
const {
	installWorkspacePlugin,
	setupStyleguideEnv,
	getStyleguideTitle,
	getServeWithPuppeteer
} = require('./helpers')

const cwd = path.resolve(__dirname, '../../../test/cli-packages')
const fs = require('fs')

beforeAll(() => {
	if (!fs.existsSync(cwd)) {
		fs.mkdirSync(cwd)
	}
})
const serve = getServeWithPuppeteer()

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

test('serve', async () => {
	const project = await createAndInstall(`serve`)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async context => {
			expect(await getStyleguideTitle(context)).toMatch('Default Style Guide')
		}
	)
})

test('serve with moved config file', async () => {
	const project = await createAndInstall(`serve-moved`)
	const config = await project.read('styleguide.config.js')
	const newFileName = 'othername.config.js'
	await project.write(newFileName, config)
	await project.rm('styleguide.config.js')
	await serve(
		() => project.run(`vue-cli-service styleguidist --config ${newFileName}`),
		async context => {
			expect(await getStyleguideTitle(context)).toMatch('Default Style Guide')
		}
	)
})
