import React from 'react'
import { Canvas, Meta, Source, Story } from './index'

describe('StorybookBlocks compatibility', () => {
	it('Meta returns null', () => {
		expect(Meta({} as any)).toBe(null)
	})

	it('Canvas renders child content', () => {
		const element = Canvas({ children: React.createElement('span', null, 'hello') }) as any
		expect(element.props['data-vsg-mdx-canvas']).toBe(true)
		expect(element.props.children.type).toBe('span')
	})

	it('Story renders function story from of', () => {
		const Fn = () => React.createElement('div', null, 'story')
		const element = Story({ of: Fn }) as any
		expect(element.props['data-vsg-mdx-story']).toBe(true)
		expect(element.props.children.type).toBe(Fn)
	})

	it('Source renders code block', () => {
		const element = Source({ code: 'const a = 1', language: 'ts' }) as any
		expect(element.type).toBe('pre')
		expect(element.props.children.type).toBe('code')
		expect(element.props.children.props.className).toContain('language-ts')
	})

	it('throws for explicit of undefined like storybook blocks', () => {
		expect(() => Canvas({ of: undefined })).toThrow(/Unexpected `of=\{undefined\}`/)
		expect(() => Story({ of: undefined })).toThrow(/Unexpected `of=\{undefined\}`/)
	})
})
