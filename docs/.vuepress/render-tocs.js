const globby = require('globby')
const path = require('path')
const fs = require('fs')

const docsFolder = path.resolve(__dirname, '..')

function slugify(text) {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
}

function buildToc(content, maxdepth) {
	const lines = content.split('\n')
	const tocLines = []
	const stack = []

	for (const line of lines) {
		const match = line.match(/^(#{1,6})\s+(.+)$/)
		if (!match) continue

		const depth = match[1].length
		if (depth > maxdepth) continue

		const title = match[2].trim()
		const slug = slugify(title)

		while (stack.length && stack[stack.length - 1].depth >= depth) {
			stack.pop()
		}

		const indent = '  '.repeat(stack.length)
		tocLines.push(`${indent}- [${title}](#${slug})`)
		stack.push({ depth, slug })
	}

	return tocLines.join('\n')
}

function insertToc(content, maxdepth) {
	const tocBlock = `<!-- toc -->\n\n${buildToc(content, maxdepth)}\n\n<!-- tocstop -->`
	if (content.includes('<!-- toc -->')) {
		return content.replace(/<!-- toc -->[\s\S]*?<!-- tocstop -->/, tocBlock)
	}
	return `${tocBlock}\n\n${content}`
}

module.exports = async function generate_tocs() {
	const files = await globby(['*.md', 'docs/*.md'], { cwd: docsFolder })
	return Promise.all(
		files.map(file => {
			return new Promise((resolve, reject) => {
				const filePath = path.join(docsFolder, file)
				fs.readFile(filePath, { encoding: 'utf8' }, function (err, data) {
					if (err) {
						reject(err)
						return
					}
					fs.writeFile(
						filePath,
						insertToc(data, file === 'Configuration.md' ? 4 : 2),
						{ encoding: 'utf8' },
						function (writeErr) {
							if (writeErr) {
								reject(writeErr)
							} else {
								console.log(`ToC updated for ${file}`)
								resolve()
							}
						}
					)
				})
			})
		})
	)
}
