import { loader } from 'webpack'
import loaderUtils from 'loader-utils'
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeExternalLinks from 'rehype-external-links'

type MdxCompileOptions = {
	remarkPlugins?: any[]
	rehypePlugins?: any[]
	providerImportSource?: string
}

export default async function (this: loader.LoaderContext, source: string | Buffer) {
	const callback = this.async()
	const cb = callback ? callback : () => null
	const options = (loaderUtils.getOptions(this) || {}) as {
		mdxCompileOptions?: MdxCompileOptions
	}
	const styleguidist = (this as any)._styleguidist || {}
	const configOptions: MdxCompileOptions = styleguidist.mdxCompileOptions || {}
	const mdxCompileOptions: MdxCompileOptions = {
		...configOptions,
		...options.mdxCompileOptions
	}

	try {
		const output = await compile(source, {
			providerImportSource: mdxCompileOptions.providerImportSource || '@mdx-js/react',
			outputFormat: 'program',
			remarkPlugins: [remarkGfm, ...(mdxCompileOptions.remarkPlugins || [])],
			rehypePlugins: [
				rehypeSlug,
				[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
				...(mdxCompileOptions.rehypePlugins || [])
			]
		})

		const transformedOutput = String(output)
			.replace('export default function MDXContent', 'function MDXContent')
			.replace('export default MDXContent', '')
		cb(
			null,
			`${transformedOutput}
export default [{ type: 'mdx', component: MDXContent }]
`
		)
	} catch (err) {
		cb(err as Error)
	}
}
