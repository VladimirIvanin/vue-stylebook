const path = require('path')
const vueLoader = require('vue-loader')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

/** @type import("@ivaninvladimir/vue-stylebook-engine").Config */
module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	simpleEditor: true,
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.js?$/,
					exclude: /(node_modules|packages)/,
					loader: 'babel-loader'
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				}
			]
		},
		plugins: [new vueLoader.VueLoaderPlugin()]
	},
	enhancePreviewApp: path.join(__dirname, 'config/enhancePreviewApp.js'),
	usageMode: 'expand',
	styleguideDir: 'dist',
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	}
}
