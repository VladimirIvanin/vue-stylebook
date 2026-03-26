import mdxLoader from './mdx-loader'
import { compile } from '@mdx-js/mdx'

vi.mock('@mdx-js/mdx', () => ({
	compile: vi.fn()
}))

describe('mdx-loader', () => {
	it('compiles MDX and exports mdx example module shape', async () => {
		;(compile as any).mockResolvedValue(
			'export default function MDXContent(){return null}\nexport default MDXContent'
		)

		const callback = vi.fn()
		const context = {
			async: () => callback,
			_styleguidist: {}
		}

		await (mdxLoader as any).call(context, '# Hello')

		expect(compile).toHaveBeenCalled()
		const output = callback.mock.calls[0][1]
		expect(output).toContain("export default [{ type: 'mdx', component: MDXContent }]")
	})

	it('merges mdxCompileOptions and uses defaults', async () => {
		;(compile as any).mockResolvedValue('export default function MDXContent(){return null}')

		const callback = vi.fn()
		const context = {
			async: () => callback,
			_styleguidist: {
				mdxCompileOptions: {
					providerImportSource: '@mdx-js/react'
				}
			}
		}

		await (mdxLoader as any).call(context, '# Hello')

		const options = (compile as any).mock.calls[0][1]
		expect(options.outputFormat).toBe('program')
		expect(options.providerImportSource).toBe('@mdx-js/react')
		expect(Array.isArray(options.remarkPlugins)).toBe(true)
		expect(Array.isArray(options.rehypePlugins)).toBe(true)
	})
})
