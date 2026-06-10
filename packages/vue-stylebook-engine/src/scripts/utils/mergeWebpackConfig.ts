import type { WebpackPluginInstance } from 'webpack'
import isFunction from 'lodash/isFunction'
import omit from 'lodash/omit'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { mergeWithCustomize, unique } = require('webpack-merge') as {
	mergeWithCustomize: (options: {
		customizeArray: ReturnType<typeof unique>
	}) => (...configs: object[]) => object
	unique: typeof import('webpack-merge').unique
}

const IGNORE_SECTIONS = ['entry', 'output', 'watch', 'stats', 'styleguidist']
const IGNORE_SECTIONS_ENV: { [key: string]: string[] } = {
	development: [],
	// For production builds, we'll ignore devtool settings to avoid
	// source mapping bloat.
	production: ['devtool'],
	removePlugins: ['plugins']
}

const IGNORE_PLUGINS = [
	'CommonsChunkPlugins',
	'MiniHtmlWebpackPlugin',
	'HtmlWebpackPlugin',
	'OccurrenceOrderPlugin',
	'DedupePlugin',
	'UglifyJsPlugin',
	'HotModuleReplacementPlugin'
]

const merge = mergeWithCustomize({
	// Ignore user’s plugins to avoid duplicates and issues with our plugins
	customizeArray: unique(
		'plugins',
		IGNORE_PLUGINS,
		(plugin: WebpackPluginInstance) => plugin.constructor && plugin.constructor.name
	)
})

//make it a typeguard
function isFunc(
	conf: any | ((env: string) => any)
): conf is (env: string) => any {
	return isFunction(conf)
}

/**
 * Merge two Webpack configs.
 *
 * In the user config:
 * - Ignores given sections (options.ignore).
 * - Ignores plugins that shouldn’t be used twice or may cause issues.
 *
 * @param {object} baseConfig
 * @param {object|Function} userConfig
 * @param {string} env
 * @return {object}
 */
export default function mergeWebpackConfig(
	baseConfig: any,
	userConfig: any | ((env: string) => any),
	env_: string
): any {
	const userConfigObject = isFunc(userConfig) ? userConfig(env_) : userConfig
	const safeUserConfig = omit(userConfigObject, IGNORE_SECTIONS.concat(IGNORE_SECTIONS_ENV[env_]))
	return merge(baseConfig, safeUserConfig)
}
