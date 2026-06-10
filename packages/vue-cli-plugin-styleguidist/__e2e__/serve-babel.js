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
	const pkg = JSON.parse(await project.read('package.json'))
	pkg.devDependencies['@vue/cli-plugin-babel'] = '*'
	pkg.devDependencies['@vue/cli-plugin-eslint'] = '*'
	pkg.devDependencies['@babel/eslint-parser'] = '*'
	pkg.devDependencies['eslint'] = '*'
	pkg.devDependencies['eslint-plugin-vue'] = '*'
	pkg['eslintConfig'] = {
		root: true,
		env: {
			node: true
		},
		extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
		rules: {},
		parserOptions: {
			parser: '@babel/eslint-parser',
			requireConfigFile: false
		}
	}
	pkg['browserslist'] = ['Chrome 70']
	await project.write('package.json', JSON.stringify(pkg, null, 2))
	await project.write(
		'vue.config.js',
		'module.exports = { transpileDependencies: true }\n'
	)
	await installWorkspacePlugin(project)
	await setupStyleguideEnv(project)
	return project
}

test('serve with babel', async () => {
	const project = await createAndInstall(`serve-babel`)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async context => {
			expect(await getStyleguideTitle(context)).toMatch('Default Style Guide')
		}
	)
})
