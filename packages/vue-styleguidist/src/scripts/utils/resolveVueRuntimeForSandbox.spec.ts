import * as fs from 'fs'
import resolveVueRuntimeForSandbox from './resolveVueRuntimeForSandbox'

describe('resolveVueRuntimeForSandbox', () => {
	const rootDir = '/tmp/project'
	const cacheRoot = `${rootDir}/node_modules/.cache/storybook`
	const runtimePath = `${rootDir}/node_modules/@vue/runtime-dom/dist/runtime-dom.esm-browser.js`
	const serverRendererPath =
		`${rootDir}/node_modules/@vue/server-renderer/dist/server-renderer.esm-browser.js`

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('returns storybook cache runtime when latest cache has vue.js', () => {
		vi.spyOn(fs, 'existsSync').mockImplementation((target: fs.PathLike) => {
			return [
				cacheRoot,
				`${cacheRoot}/v1/sb-vite/deps/vue.js`,
				serverRendererPath
			].includes(String(target))
		})
		vi.spyOn(fs, 'readdirSync').mockReturnValue([
			{ isDirectory: () => true, name: 'v1' }
		] as any)
		vi.spyOn(fs, 'statSync').mockReturnValue({
			mtime: new Date('2026-03-20T00:00:00.000Z')
		} as fs.Stats)

		expect(resolveVueRuntimeForSandbox(rootDir)).toEqual({
			runtimeDevPath: `${cacheRoot}/v1/sb-vite/deps/vue.js`,
			serverRendererPath,
			source: 'storybook-cache'
		})
	})

	it('falls back to node_modules runtime when cache does not exist', () => {
		vi.spyOn(fs, 'existsSync').mockImplementation((target: fs.PathLike) => {
			return [runtimePath, serverRendererPath].includes(String(target))
		})

		expect(resolveVueRuntimeForSandbox(rootDir)).toEqual({
			runtimeDevPath: runtimePath,
			serverRendererPath,
			source: 'node-modules'
		})
	})

	it('returns unresolved when no runtime is found', () => {
		vi.spyOn(fs, 'existsSync').mockReturnValue(false)

		expect(resolveVueRuntimeForSandbox(rootDir)).toEqual({
			runtimeDevPath: null,
			serverRendererPath: null,
			source: 'unresolved'
		})
	})

	it('picks newest storybook cache by mtime', () => {
		vi.spyOn(fs, 'existsSync').mockImplementation((target: fs.PathLike) => {
			return [
				cacheRoot,
				`${cacheRoot}/new/sb-vite/deps/vue.js`,
				serverRendererPath
			].includes(String(target))
		})
		vi.spyOn(fs, 'readdirSync').mockReturnValue([
			{ isDirectory: () => true, name: 'old' },
			{ isDirectory: () => true, name: 'new' }
		] as any)
		vi.spyOn(fs, 'statSync').mockImplementation((target: fs.PathLike) => {
			const file = String(target)
			return {
				mtime: file.endsWith('/old')
					? new Date('2026-03-20T00:00:00.000Z')
					: new Date('2026-03-21T00:00:00.000Z')
			} as fs.Stats
		})

		expect(resolveVueRuntimeForSandbox(rootDir)).toEqual({
			runtimeDevPath: `${cacheRoot}/new/sb-vite/deps/vue.js`,
			serverRendererPath,
			source: 'storybook-cache'
		})
	})
})
