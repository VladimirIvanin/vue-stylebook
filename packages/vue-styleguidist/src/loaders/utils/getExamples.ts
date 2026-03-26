import * as Rsg from 'react-styleguidist'
import * as fs from 'fs'
import * as path from 'path'
import qss from 'qss'
import requireIt from 'react-styleguidist/lib/loaders/utils/requireIt'
import getDocsLoader from './getDocsLoader'

/**
 * Get require statement for examples file if it exists, or for default examples if it was defined.
 *
 * @param {string} file
 * @param {string} examplesFile
 * @param {string} displayName
 * @param {string} defaultExample
 * @param {boolean} isComponentDocInVueFile
 * @returns {object|Array}
 */
export default function getExamples(
	file: string,
	examplesFile: string | false,
	displayName?: string,
	defaultExample?: string,
	isComponentDocInVueFile?: boolean
): Rsg.RequireItResult | null {
	const examplesFileToLoad = examplesFile || defaultExample
	if (!examplesFileToLoad) {
		return null
	}

	const relativePath = `./${path.relative(path.dirname(examplesFileToLoad), file)}`

	const query = {
		displayName,
		file: relativePath,
		shouldShowDefaultExample: !examplesFile && !!defaultExample && !isComponentDocInVueFile,
		customLangs: 'vue|js|jsx|html'
	}

	if (examplesFile && fs.existsSync(examplesFile)) {
		const docsLoader = getDocsLoader(examplesFile)
		return requireIt(`!!${docsLoader}?${qss.encode(query)}!${examplesFile}`)
	}

	if (defaultExample && !isComponentDocInVueFile) {
		const docsLoader = getDocsLoader(defaultExample)
		return requireIt(`!!${docsLoader}?${qss.encode(query)}!${defaultExample}`)
	}

	return null
}
