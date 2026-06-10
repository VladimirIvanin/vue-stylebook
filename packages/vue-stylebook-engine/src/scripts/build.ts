import webpackNormal, { MultiStats, Stats } from 'webpack'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'

export default function build(
	config: SanitizedStyleguidistConfig,
	handler: (err: Error | null | undefined, stats: Stats | MultiStats | undefined) => void
) {
	const webpack: typeof webpackNormal = process.env.VSG_WEBPACK_PATH
		? require(process.env.VSG_WEBPACK_PATH)
		: webpackNormal

	const compiler = webpack(makeWebpackConfig(config, 'production'))
	compiler.run((err, stats) => {
		handler(err, stats)
	})
	return compiler
}
