'use strict'

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const pkgRoot = path.join(__dirname, '..')
const required = ['lib/bin/styleguidist.js', 'lib/scripts/index.js']

for (const file of required) {
	if (!fs.existsSync(path.join(pkgRoot, file))) {
		console.error(`Missing ${file} — run pnpm compile before publishing.`)
		process.exit(1)
	}
}

const output = execSync('npm pack --dry-run --ignore-scripts 2>&1', {
	cwd: pkgRoot,
	encoding: 'utf8',
	shell: true
})

if (!output.includes('lib/bin/styleguidist.js')) {
	console.error('npm pack is missing lib/bin/styleguidist.js — check the "files" field in package.json.')
	process.exit(1)
}
