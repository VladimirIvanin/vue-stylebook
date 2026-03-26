const title = 'Vue Styleguidist'
const ogprefix = 'og: http://ogp.me/ns#'
const description = 'Isolated Vue component development environment with a living style guide'
const fs = require('fs')
const path = require('path')

const titleShare = `${title} docs`
const repoName = process.env.GITHUB_REPOSITORY
	? process.env.GITHUB_REPOSITORY.split('/')[1]
	: ''
const base = repoName ? `/${repoName}/` : '/'
const debugEndpoint =
	'http://127.0.0.1:7509/ingest/43d6e5ca-e642-460a-92cd-46bcc8ddc3bf'

function sendDebugLog(payload) {
	// #region agent log
	fetch(debugEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Debug-Session-Id': '9eed6c'
		},
		body: JSON.stringify({
			sessionId: '9eed6c',
			runId: process.env.GITHUB_RUN_ID || 'local',
			timestamp: Date.now(),
			...payload
		})
	}).catch(() => {})
	// #endregion
}

sendDebugLog({
	hypothesisId: 'H1',
	location: 'docs/.vuepress/config.js:11',
	message: 'Computed VuePress base value',
	data: {
		githubRepository: process.env.GITHUB_REPOSITORY || null,
		repoName,
		base
	}
})

module.exports = () => {
	sendDebugLog({
		hypothesisId: 'H2',
		location: 'docs/.vuepress/config.js:34',
		message: 'VuePress config factory invoked',
		data: {
			nodeEnv: process.env.NODE_ENV || null,
			githubRef: process.env.GITHUB_REF || null,
			githubSha: process.env.GITHUB_SHA || null
		}
	})

	return {
		base,
		dest: 'docs/dist',
		title,
		description,
		// prettier-ignore
		head: [
			
			['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/favicons/apple-touch-icon.png' }],
			['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/assets/favicons/favicon-32x32.png' }],
			['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/assets/favicons/favicon-16x16.png' }],
			['link', { rel: 'mask-icon', href: '/assets/favicons/safari-pinned-tab.svg', color: '#41B883' }],
			['link', { rel: 'shortcut icon', type: 'image/x-icon', href: '/assets/favicons/favicon.ico' }],
			['meta', { prefix: ogprefix, property: 'og:title', content: titleShare }],
			['meta', { prefix: ogprefix, property: 'twitter:title', content: titleShare }],
			['meta', { prefix: ogprefix, property: 'og:type', content: 'website' }],
			['meta', { prefix: ogprefix, property: 'og:description', content: description }],
			['meta', { prefix: ogprefix, property: 'og:image', content: '/assets/logo.png' }],
			["script", { src: "https://unpkg.com/thesemetrics@latest", async: "" }],
		],
		themeConfig: {
			repo: 'vue-styleguidist/vue-styleguidist',
			docsBranch: 'dev',
			editLinks: true,
			docsDir: 'docs',
			algolia: {
				apiKey: '27d4fa7b11db706f186d098352d5ae3e',
				indexName: 'vue-styleguidist'
			},
			nav: [
				{ text: 'Docs', link: '/docs/GettingStarted' },
				...(fs.existsSync(path.resolve(__dirname, '../Examples.md'))
					? [{ text: 'Examples', link: '/Examples' }]
					: []),
				{ text: 'Vue CLI Plugin', link: '/VueCLI3doc' },
				{ text: 'Reference', link: '/Configuration' }
			],
			sidebar: {
				'/docs/': [
					['/docs/GettingStarted', 'Getting Started'],
					'/docs/Documenting',
					['/docs/Components', 'Locating Components'],
					'/docs/CLI',
					'/docs/Customize',
					'/docs/Webpack',
					'/docs/Cookbook',
					'/docs/API',
					'/docs/Deployment',
					'/docs/Docgen',
					...(fs.existsSync(path.resolve(__dirname, '../docs/docgen-cli.md'))
						? ['/docs/docgen-cli.md']
						: []),
					'/docs/Development'
				],
				'/Configuration': ['/Configuration'],
				'/Examples': ['/Examples']
			}
		}
	}
}
