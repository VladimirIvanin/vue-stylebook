import webpackNormal, { Configuration } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import merge from 'webpack-merge'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'
import { ServerInfo } from './binutils'
import resolveVueRuntimeForSandbox from './utils/resolveVueRuntimeForSandbox'

export default function createServer(
	config: SanitizedStyleguidistConfig,
	env: 'development' | 'production' | 'none'
): ServerInfo {
	const webpackConfig: Configuration = makeWebpackConfig(config, env)
	const { devServer: webpackDevServerConfig } = merge(
		{
			devServer: {
				noInfo: true,
				compress: true,
				clientLogLevel: 'none',
				hot: true,
				disableHostCheck: true,
				injectClient: false,
				watchOptions: {
					ignored: /node_modules/
				},
				watchContentBase: config.assetsDir !== undefined,
				stats: webpackConfig.stats || false
			}
		},
		{
			devServer: webpackConfig.devServer
		},
		{
			devServer: {
				contentBase: config.assetsDir
			}
		}
	)

	const webpack: typeof webpackNormal = process.env.VSG_WEBPACK_PATH
		? require(process.env.VSG_WEBPACK_PATH)
		: webpackNormal

	const compiler = webpack(webpackConfig)
	const devServer = new WebpackDevServer(compiler, webpackDevServerConfig)
	const resolvedVueRuntime = resolveVueRuntimeForSandbox(config.configDir)

	if (resolvedVueRuntime.runtimeDevPath || resolvedVueRuntime.serverRendererPath) {
		devServer.app.get('/__vsg-runtime/vue', (_req, res) => {
			if (!resolvedVueRuntime.runtimeDevPath) {
				res.status(404).send('Vue runtime for REPL is not resolved')
				return
			}
			res.sendFile(resolvedVueRuntime.runtimeDevPath)
		})

		devServer.app.get('/__vsg-runtime/vue-server-renderer', (_req, res) => {
			if (!resolvedVueRuntime.serverRendererPath) {
				res.status(404).send('Vue server renderer for REPL is not resolved')
				return
			}
			res.sendFile(resolvedVueRuntime.serverRendererPath)
		})
	}

	// User defined customizations
	if (config.configureServer) {
		config.configureServer(devServer, env)
	}

	return { app: devServer, compiler }
}
