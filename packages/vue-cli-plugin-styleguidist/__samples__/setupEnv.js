const path = require('path')

// Use the workspace webpack instance to avoid duplicate webpack copies
// (required for webpack 5 compatibility with StyleguidistOptionsPlugin).
const enginePath = require.resolve('@ivaninvladimir/vue-stylebook-engine')
process.env.VSG_WEBPACK_PATH = require.resolve('webpack', {
	paths: [path.dirname(enginePath)]
})
