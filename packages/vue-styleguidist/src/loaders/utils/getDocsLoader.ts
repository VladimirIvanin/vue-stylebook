import * as path from 'path'

const examplesLoader = path.resolve(__dirname, '../examples-loader.js')
const mdxLoader = path.resolve(__dirname, '../mdx-loader.js')

export default function getDocsLoader(filePath: string): string {
	return /\.mdx$/i.test(filePath) ? mdxLoader : examplesLoader
}
