import * as fs from 'fs'
import * as path from 'path'
import resolveVueRuntimeForSandbox from './resolveVueRuntimeForSandbox'

vi.mock('fs', () => ({
	existsSync: vi.fn(),
	readdirSync: vi.fn(),
	statSync: vi.fn()
}))

describe('resolveVueRuntimeForSandbox', () => {
	const rootDir = path.resolve(path.sep, 'tmp', 'project')
	const cacheRoot = path.resolve(rootDir, 'node_modules', '.cache', 'storybook')
	const runtimePath = path.resolve(
		rootDir,
		'node_modules',
		'@vue',
		'runtime-dom',
		'dist',
		'runtime-dom.esm-browser.js'
	)
	const serverRendererPath = path.resolve(
		rootDir,
		'node_modules',
		'@vue',
		'server-renderer',
		'dist',
		'server-renderer.esm-browser.js'
	)

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('returns storybook cache runtime when latest cache has vue.js', () => {
		vi.mocked(fs.existsSync).mockImplementation((target: fs.PathLike) => {
			return [
				cacheRoot,
				path.resolve(cacheRoot, 'v1', 'sb-vite', 'deps', 'vue.js'),
				serverRendererPath
			].includes(String(target))
		})
		vi.mocked(fs.readdirSync).mockReturnValue([{ isDirectory: () => true, name: 'v1' }] as any)
		vi.mocked(fs.statSync).mockReturnValue({
			mtime: new Date('2026-03-20T00:00:00.000Z')
		} as fs.Stats)

		expect(resolveVueRuntimeForSandbox(rootDir)).toEqual({
			runtimeDevPath: path.resolve(cacheRoot, 'v1', 'sb-vite', 'deps', 'vue.js'),
			serverRendererPath,
			source: 'storybook-cache'
		})
	})

	it('falls back to node_modules runtime when cache does not exist', () => {
		vi.mocked(fs.existsSync).mockImplementation((target: fs.PathLike) => {
			return [runtimePath, serverRendererPath].includes(String(target))
		})

		expect(resolveVueRuntimeForSandbox(rootDir)).toEqual({
			runtimeDevPath: runtimePath,
			serverRendererPath,
			source: 'node-modules'
		})
	})

	it('returns unresolved when no runtime is found', () => {
		vi.mocked(fs.existsSync).mockReturnValue(false)

		expect(resolveVueRuntimeForSandbox(rootDir)).toEqual({
			runtimeDevPath: null,
			serverRendererPath: null,
			source: 'unresolved'
		})
	})

	it('picks newest storybook cache by mtime', () => {
		vi.mocked(fs.existsSync).mockImplementation((target: fs.PathLike) => {
			return [
				cacheRoot,
				path.resolve(cacheRoot, 'new', 'sb-vite', 'deps', 'vue.js'),
				serverRendererPath
			].includes(String(target))
		})
		vi.mocked(fs.readdirSync).mockReturnValue([
			{ isDirectory: () => true, name: 'old' },
			{ isDirectory: () => true, name: 'new' }
		] as any)
		vi.mocked(fs.statSync).mockImplementation((target: fs.PathLike) => {
			const file = String(target)
			return {
				mtime: file.endsWith(`${path.sep}old`)
					? new Date('2026-03-20T00:00:00.000Z')
					: new Date('2026-03-21T00:00:00.000Z')
			} as fs.Stats
		})

		expect(resolveVueRuntimeForSandbox(rootDir)).toEqual({
			runtimeDevPath: path.resolve(cacheRoot, 'new', 'sb-vite', 'deps', 'vue.js'),
			serverRendererPath,
			source: 'storybook-cache'
		})
	})
})
