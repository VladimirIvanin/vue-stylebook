import { normalizeCode } from './PlaygroundVueRepl'

describe('PlaygroundVueRepl', () => {
	it('normalizes string code payload', () => {
		expect(normalizeCode('<template><div>Hello</div></template>')).toBe(
			'<template><div>Hello</div></template>'
		)
	})

	it('normalizes codeSplit payload with raw field', () => {
		expect(normalizeCode({ raw: '<template><div>Hello</div></template>' })).toBe(
			'<template><div>Hello</div></template>'
		)
	})

	it('returns empty string when payload is missing raw code', () => {
		expect(normalizeCode({})).toBe('')
	})
})
