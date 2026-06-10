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
const serve = require('@vue/cli-test-utils/serveWithPuppeteer')

async function createAndInstall(name, isClass) {
	const project = await create(
		name,
		{
			vueVersion: '3',
			plugins: {
				'vue-cli-plugin-styleguidist': {},
				'@vue/cli-plugin-typescript': { classComponent: isClass }
			}
		},
		cwd,
		false
	)
	await installWorkspacePlugin(project)
	await setupStyleguideEnv(project)
	return project
}

test('serve with typescript', async () => {
	const project = await createAndInstall(`serve-ts`)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async ({ helpers }) => {
			expect(await helpers.getText('h1[class^=rsg--logo]')).toMatch('Default Style Guide')
		}
	)
})

test('serve with typescript class', async () => {
	const project = await createAndInstall(`serve-ts-class`, true)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async ({ helpers }) => {
			expect(await helpers.getText('h1[class^=rsg--logo]')).toMatch('Default Style Guide')
		}
	)
})
