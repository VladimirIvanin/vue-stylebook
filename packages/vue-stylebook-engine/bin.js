#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const entry = path.join(__dirname, 'lib/bin/styleguidist.js')

if (!fs.existsSync(entry)) {
	const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
	console.error(
		`@ivaninvladimir/vue-stylebook-engine@${pkg.version} установлен неполно: нет lib/bin/styleguidist.js. Переустановите зависимости или используйте версию 0.6.0.`
	)
	process.exit(1)
}

require(entry)
