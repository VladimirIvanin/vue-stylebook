const createDocsConfig = require('./config')

describe('docs vuepress config', () => {
	it('enables fulltext search plugin', () => {
		const config = createDocsConfig()

		expect(config.plugins).toContain('fulltext-search')
	})

	it('does not define algolia search config', () => {
		const config = createDocsConfig()

		expect(config.themeConfig.algolia).toBeUndefined()
	})
})
