import * as fs from 'fs'
import * as path from 'path'

export interface ResolvedVueRuntimeForSandbox {
	runtimeDevPath: string | null
	serverRendererPath: string | null
	source: 'storybook-cache' | 'node-modules' | 'unresolved'
}

function getLatestStorybookCacheDir(cacheRoot: string): string | null {
	if (!fs.existsSync(cacheRoot)) {
		return null
	}

	let latest: { path: string; mtime: number } | null = null
	for (const dirent of fs.readdirSync(cacheRoot, { withFileTypes: true })) {
		if (!dirent.isDirectory()) continue
		if (dirent.name === 'default') continue

		const fullPath = path.join(cacheRoot, dirent.name)
		const stats = fs.statSync(fullPath)
		if (!latest || stats.mtime.getTime() > latest.mtime) {
			latest = { path: fullPath, mtime: stats.mtime.getTime() }
		}
	}

	return latest?.path || null
}

export default function resolveVueRuntimeForSandbox(rootDir: string): ResolvedVueRuntimeForSandbox {
	const cacheRoot = path.resolve(rootDir, 'node_modules', '.cache', 'storybook')
	const latestStorybookCache = getLatestStorybookCacheDir(cacheRoot)
	const storybookRuntime = latestStorybookCache
		? path.join(latestStorybookCache, 'sb-vite', 'deps', 'vue.js')
		: null

	const nodeModulesRuntime = path.resolve(
		rootDir,
		'node_modules',
		'@vue',
		'runtime-dom',
		'dist',
		'runtime-dom.esm-browser.js'
	)
	const nodeModulesServerRenderer = path.resolve(
		rootDir,
		'node_modules',
		'@vue',
		'server-renderer',
		'dist',
		'server-renderer.esm-browser.js'
	)

	const runtimeDevPath = storybookRuntime && fs.existsSync(storybookRuntime)
		? storybookRuntime
		: fs.existsSync(nodeModulesRuntime)
			? nodeModulesRuntime
			: null
	const serverRendererPath = fs.existsSync(nodeModulesServerRenderer)
		? nodeModulesServerRenderer
		: null

	if (runtimeDevPath && storybookRuntime && runtimeDevPath === storybookRuntime) {
		return {
			runtimeDevPath,
			serverRendererPath,
			source: 'storybook-cache'
		}
	}

	if (runtimeDevPath) {
		return {
			runtimeDevPath,
			serverRendererPath,
			source: 'node-modules'
		}
	}

	return {
		runtimeDevPath: null,
		serverRendererPath,
		source: 'unresolved'
	}
}
