import webpackNormal from 'webpack'
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
	const webpackConfig: any = makeWebpackConfig(config, env)
	const resolvedVueRuntime = resolveVueRuntimeForSandbox(config.configDir)

	const webpackDevServerConfig = merge(
		{
			compress: true,
			allowedHosts: 'all',
			hot: true,
			host: config.serverHost,
			port: config.serverPort,
			watchFiles: {
				options: {
					ignored: /node_modules/
				}
			},
			devMiddleware: {
				stats: webpackConfig.stats || false
			},
			setupMiddlewares: (middlewares, devServer) => {
				if (!devServer.app) {
					return middlewares
				}

				if (resolvedVueRuntime.runtimeDevPath || resolvedVueRuntime.serverRendererPath) {
					devServer.app.get('/__vsg-runtime/vue', (_req: any, res: any) => {
						if (!resolvedVueRuntime.runtimeDevPath) {
							res.status(404).send('Vue runtime for REPL is not resolved')
							return
						}
						res.sendFile(resolvedVueRuntime.runtimeDevPath)
					})

					devServer.app.get('/__vsg-runtime/vue-server-renderer', (_req: any, res: any) => {
						if (!resolvedVueRuntime.serverRendererPath) {
							res.status(404).send('Vue server renderer for REPL is not resolved')
							return
						}
						res.sendFile(resolvedVueRuntime.serverRendererPath)
					})
				}

				if (config.configureServer) {
					config.configureServer(devServer as WebpackDevServer, env)
				}

				return middlewares
			}
		} as any,
		webpackConfig.devServer || {},
		config.assetsDir
			? ({
					static: [
						{
							directory: config.assetsDir,
							watch: true
						}
					]
			  } as any)
			: {}
	) as any

	// webpack-dev-server 5 moved stats under devMiddleware
	if (webpackDevServerConfig.stats !== undefined) {
		webpackDevServerConfig.devMiddleware = {
			...webpackDevServerConfig.devMiddleware,
			stats: webpackDevServerConfig.stats
		}
		delete webpackDevServerConfig.stats
	}

	// webpack-dev-server 5 moved publicPath under devMiddleware
	if (webpackDevServerConfig.publicPath !== undefined) {
		webpackDevServerConfig.devMiddleware = {
			...webpackDevServerConfig.devMiddleware,
			publicPath: webpackDevServerConfig.publicPath
		}
		delete webpackDevServerConfig.publicPath
	}

	// sockPath (WDS 3) → webSocketServer (WDS 5)
	if (webpackDevServerConfig.sockPath !== undefined) {
		const sockPath = webpackDevServerConfig.sockPath
		delete webpackDevServerConfig.sockPath
		webpackDevServerConfig.webSocketServer = {
			type: 'ws',
			options: { path: sockPath.startsWith('/') ? sockPath : `/${sockPath}` }
		}
	}

	// styleguidist uses react-dev-utils/webpackHotDevClient instead of the built-in client
	if (webpackConfig.devServer?.client === false) {
		webpackDevServerConfig.client = false
	}

	const webpack: typeof webpackNormal = process.env.VSG_WEBPACK_PATH
		? require(process.env.VSG_WEBPACK_PATH)
		: webpackNormal

	const compiler = webpack(webpackConfig as any)
	const devServer = new WebpackDevServer(webpackDevServerConfig, compiler as any)

	return { app: devServer, compiler }
}
