import React from 'react'

type AnyObject = Record<string, any>

const asReactElement = (story: any): React.ReactNode => {
	if (!story) {
		return null
	}
	if (React.isValidElement(story)) {
		return story
	}
	if (typeof story === 'function') {
		return React.createElement(story as React.ComponentType)
	}
	if (typeof story === 'object') {
		try {
			if (typeof story.render === 'function') {
				const out = story.render(story.args || {}, {})
				if (React.isValidElement(out)) {
					return out
				}
			}
			if (story.component) {
				return React.createElement(story.component, story.args || {})
			}
		} catch (err) {
			// Keep docs page render resilient when story format differs.
			return React.createElement('pre', null, String(err))
		}
	}
	return null
}

export function Meta(_props: AnyObject) {
	return null
}

export function Canvas(props: { of?: any; children?: React.ReactNode }) {
	if ('of' in props && props.of === undefined) {
		throw new Error('Unexpected `of={undefined}`, did you mistype a CSF file reference?')
	}
	const rendered = props.children || asReactElement(props.of)
	return React.createElement('div', { 'data-vsg-mdx-canvas': true }, rendered)
}

export function Story(props: { of?: any; children?: React.ReactNode }) {
	if ('of' in props && props.of === undefined) {
		throw new Error('Unexpected `of={undefined}`, did you mistype a CSF file reference?')
	}
	const rendered = props.children || asReactElement(props.of)
	return React.createElement('div', { 'data-vsg-mdx-story': true }, rendered)
}

export function Source(props: { code?: string; language?: string; children?: React.ReactNode }) {
	const code = props.code || (typeof props.children === 'string' ? props.children : '')
	return React.createElement(
		'pre',
		{ 'data-vsg-mdx-source': true },
		React.createElement('code', { className: props.language ? `language-${props.language}` : '' }, code)
	)
}
