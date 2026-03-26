function createPlugin(sidebar = {}) {
	delete require.cache[require.resolve('vuepress-plugin-fulltext-search')]
	const fulltextSearchPlugin = require('vuepress-plugin-fulltext-search')

	return fulltextSearchPlugin(
		{},
		{},
		{
			_pluginContext: {
				themeConfig: {
					sidebar
				}
			}
		}
	)
}

function createPage(overrides = {}) {
	return {
		path: '/docs/SearchGuide.html',
		_strippedContent: '# Заголовок\nТекст страницы',
		headers: [{ title: 'Введение' }],
		_context: {
			markdown: {
				render: () => ({
					html: '<h1>Заголовок</h1><h2>Введение</h2><p>Résumé Поиск по MD</p>'
				}),
				renderInline: (value) => value
			}
		},
		...overrides
	}
}

describe('fulltext-search plugin integration', () => {
	it('indexes markdown body text and headers', () => {
		const plugin = createPlugin()
		const page = createPage()

		plugin.extendPageData(page)

		expect(page.content).toContain('Поиск по MD')
		expect(page.headersStr).toBe('Введение')
		expect(page.headers[0].normalizedTitle).toBe('введение')
		expect(page.headers[0].charIndex).toBeGreaterThan(-1)
	})

	it('normalizes accents and keeps cyrillic charset flag', () => {
		const plugin = createPlugin()
		const page = createPage()

		plugin.extendPageData(page)

		expect(page.normalizedContent).toContain('resume')
		expect(page.charsets).toEqual({ cyrillic: true })
	})

	it('uses sidebar title when page title is missing', () => {
		const plugin = createPlugin({
			'/docs/': [['/docs/SearchGuide.md', 'Руководство по поиску']]
		})
		const page = createPage({ title: '' })

		plugin.extendPageData(page)

		expect(page.title).toBe('Руководство по поиску')
	})
})
