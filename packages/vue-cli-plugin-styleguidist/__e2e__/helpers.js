const path = require('path')
const fs = require('fs')

const fsp = fs.promises
const os = require('os')
const { execSync } = require('child_process')

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

	const wmVersion =
		require(path.join(pluginDir, 'package.json')).dependencies['webpack-merge']
	const pluginNodeModules = path.join(pluginDest, 'node_modules')
	const tempDir = path.join(pluginDest, '.webpack-merge-install')

	await fsp.rm(tempDir, { recursive: true, force: true })
	await fsp.mkdir(tempDir, { recursive: true })
	await fsp.writeFile(path.join(tempDir, 'package.json'), '{"private":true}')

	try {
		execSync(
			`npm install webpack-merge@${wmVersion} --omit=dev --no-package-lock --no-audit --no-fund`,
			{ cwd: tempDir, stdio: 'pipe' }
		)

		await fsp.mkdir(pluginNodeModules, { recursive: true })
		const installedModules = path.join(tempDir, 'node_modules')
		for (const entry of await fsp.readdir(installedModules)) {
			const source = path.join(installedModules, entry)
			const target = path.join(pluginNodeModules, entry)
			await fsp.rm(target, { recursive: true, force: true })
			await fsp.cp(source, target, { recursive: true, verbatimSymlinks: false })
		}
	} finally {
		await fsp.rm(tempDir, { recursive: true, force: true })
	}
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

async function getStyleguideTitle({ page, helpers }) {
	await page.waitForSelector('h1[class^=rsg--logo]', { timeout: 30000 })
	return helpers.getText('h1[class^=rsg--logo]')
}

function getServeWithPuppeteer() {
	const servePath = require.resolve('@vue/cli-test-utils/serveWithPuppeteer')
	const launchPath = require.resolve('@vue/cli-test-utils/launchPuppeteer')
	const legacyPuppeteerPath = require.resolve('puppeteer', {
		paths: [path.dirname(launchPath)]
	})

	delete require.cache[servePath]
	delete require.cache[launchPath]
	delete require.cache[legacyPuppeteerPath]

	const puppeteer = require('puppeteer')
	const executablePath = resolvePuppeteerExecutable(puppeteer)
	const noSandboxArgs = ['--no-sandbox', '--disable-setuid-sandbox']

	require.cache[legacyPuppeteerPath] = {
		id: legacyPuppeteerPath,
		filename: legacyPuppeteerPath,
		loaded: true,
		exports: {
			...puppeteer,
			launch(options = {}) {
				const args = [...new Set([...(options.args || []), ...noSandboxArgs])]
				return puppeteer.launch({
					...options,
					...(executablePath ? { executablePath } : {}),
					args
				})
			}
		}
	}

	return require('@vue/cli-test-utils/serveWithPuppeteer')
}

function resolvePuppeteerExecutable(puppeteer) {
	const candidates = []
	if (process.env.PUPPETEER_EXECUTABLE_PATH) {
		candidates.push(process.env.PUPPETEER_EXECUTABLE_PATH)
	}
	try {
		candidates.push(puppeteer.executablePath())
	} catch (err) {
		// Puppeteer throws when the pinned browser is not installed.
	}

	const cacheDir = path.join(
		process.env.PUPPETEER_CACHE_DIR || path.join(os.homedir(), '.cache', 'puppeteer'),
		'chrome'
	)
	try {
		for (const entry of fs.readdirSync(cacheDir).sort().reverse()) {
			candidates.push(path.join(cacheDir, entry, getChromeExecutableName()))
		}
	} catch (err) {
		// Keep Puppeteer's default resolution when the cache directory is absent.
	}

	return candidates.find(candidate => candidate && fs.existsSync(candidate))
}

function getChromeExecutableName() {
	if (process.platform === 'win32') {
		return path.join('chrome-win64', 'chrome.exe')
	}
	if (process.platform === 'darwin') {
		return path.join(
			'chrome-mac-x64',
			'Google Chrome for Testing.app',
			'Contents',
			'MacOS',
			'Google Chrome for Testing'
		)
	}
	return path.join('chrome-linux64', 'chrome')
}

module.exports = {
	installWorkspacePlugin,
	setupStyleguideEnv,
	getStyleguideTitle,
	getServeWithPuppeteer,
	pluginDir
}
