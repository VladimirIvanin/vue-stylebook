import React from 'react'
import PropTypes from 'prop-types'
import Playground from 'rsg-components/Playground'
import Markdown from 'rsg-components/Markdown'
import ExamplesRenderer from 'rsg-components/Examples/ExamplesRenderer'
import { useStyleGuideContext } from 'rsg-components/Context'

interface MdxExample {
	type: 'mdx'
	component: any
}

type Example = {
	type: 'code' | 'markdown'
	content?: any
	evalInContext?: any
	settings?: any
} | MdxExample

export default function Examples({
	examples,
	name,
	exampleMode
}: {
	examples: Example[]
	name: string
	exampleMode: string
}) {
	const { codeRevision } = useStyleGuideContext()

	return (
		<ExamplesRenderer name={name}>
			{examples.map((example, index) => {
				switch (example.type) {
					case 'code':
						return (
							<Playground
								code={example.content}
								evalInContext={example.evalInContext}
								key={`${codeRevision}/${index}`}
								name={name}
								index={index}
								settings={example.settings}
								exampleMode={exampleMode}
							/>
						)
					case 'markdown':
						return <Markdown text={example.content} key={index} />
					case 'mdx': {
						const MdxComponent = example.component
						return MdxComponent ? <MdxComponent key={index} /> : null
					}
					default:
						return null
				}
			})}
		</ExamplesRenderer>
	)
}

;(Examples as any).propTypes = {
	examples: PropTypes.array.isRequired,
	name: PropTypes.string.isRequired,
	exampleMode: PropTypes.string.isRequired
}
