import getDocsLoader from './getDocsLoader'

describe('getDocsLoader', () => {
	it('returns mdx-loader for .mdx files', () => {
		expect(getDocsLoader('/tmp/Doc.mdx')).toContain('mdx-loader.js')
	})

	it('returns examples-loader for .md files', () => {
		expect(getDocsLoader('/tmp/Doc.md')).toContain('examples-loader.js')
	})
})
