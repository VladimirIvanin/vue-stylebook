import type { Compiler, Compilation, NormalModule } from 'webpack'

type StyleguidistOptions = Record<string, unknown>

export default class StyleguidistOptionsPlugin {
	public options: StyleguidistOptions

	public constructor(options: StyleguidistOptions) {
		this.options = options
	}

	public apply(compiler: Compiler) {
		const pluginFunc = (context: any, module: NormalModule) => {
			if (!module.resource) {
				return
			}

			context._styleguidist = this.options
		}

		compiler.hooks.compilation.tap('StyleguidistOptionsPlugin', (compilation: Compilation) => {
			const webpack = compiler.webpack
			webpack.NormalModule.getCompilationHooks(compilation).loader.tap(
				'StyleguidistOptionsPlugin',
				pluginFunc
			)
		})
	}
}
