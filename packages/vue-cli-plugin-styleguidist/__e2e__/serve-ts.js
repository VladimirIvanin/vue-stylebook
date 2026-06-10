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

async function addTypescriptSupport(project) {
	await project.write(
		'tsconfig.json',
		JSON.stringify(
			{
				compilerOptions: {
					target: 'esnext',
					module: 'esnext',
					strict: true,
					jsx: 'preserve',
					moduleResolution: 'node',
					skipLibCheck: true,
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					forceConsistentCasingInFileNames: true,
					useDefineForClassFields: true,
					sourceMap: true,
					baseUrl: '.',
					types: ['webpack-env'],
					paths: { '@/*': ['src/*'] },
					lib: ['esnext', 'dom', 'dom.iterable', 'scripthost']
				},
				include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
				exclude: ['node_modules']
			},
			null,
			2
		)
	)

	await project.write(
		'src/shims-vue.d.ts',
		`declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
`
	)

	const mainJs = await project.read('src/main.js')
	await project.write('src/main.ts', mainJs)
	await project.rm('src/main.js')

	const appVue = await project.read('src/App.vue')
	await project.write('src/App.vue', appVue.replace('<script>', '<script lang="ts">'))
}

async function createAndInstall(name) {
	const project = await create(
		name,
		{
			vueVersion: '3',
			plugins: { 'vue-cli-plugin-styleguidist': {} }
		},
		cwd,
		false
	)
	await addTypescriptSupport(project)
	await installWorkspacePlugin(project)
	await setupStyleguideEnv(project)
	return project
}

test('serve with typescript', async () => {
	const project = await createAndInstall(`serve-ts`)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async context => {
			expect(await getStyleguideTitle(context)).toMatch('Default Style Guide')
		}
	)
})

test('serve with typescript class', async () => {
	const project = await createAndInstall(`serve-ts-class`)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async context => {
			expect(await getStyleguideTitle(context)).toMatch('Default Style Guide')
		}
	)
})
