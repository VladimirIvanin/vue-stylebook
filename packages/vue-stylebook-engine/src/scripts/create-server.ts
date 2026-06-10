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
			client: {
				logging: 'none'
			},
			watchFiles: {
				options: {
					ignored: /node_modules/
				}
			},
			stats: webpackConfig.stats || false,
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

	const webpack: typeof webpackNormal = process.env.VSG_WEBPACK_PATH
		? require(process.env.VSG_WEBPACK_PATH)
		: webpackNormal

	const compiler = webpack(webpackConfig as any)
	const devServer = new WebpackDevServer(webpackDevServerConfig, compiler as any)

	return { app: devServer, compiler }
}
