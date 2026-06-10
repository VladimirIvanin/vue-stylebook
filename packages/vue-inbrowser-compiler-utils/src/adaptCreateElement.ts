import camelCase from 'camelcase'
import { withDirectives, resolveDirective } from 'vue'

export type CreateElementFunction = (
	component: string | object,
	attributes?: { [k: string]: any },
	children?: any | any[]
) => any[] | any

/**
 * Groups attributes passed to a React pragma to the Vue 3 h() fashion
 * @param h the VueJS createElement function passed in render functions
 * @returns pragma usable in buble rendered JSX for VueJS
 */
export default function adaptCreateElement(h: CreateElementFunction): CreateElementFunction {
	return (comp, attr, ...children: any[]) => {
		const grouped = groupAttr(attr)
		const directives = grouped?.directives as { name: string; value: any }[] | undefined
		const props = grouped && directives ? (({ directives: _d, ...rest }) => rest)(grouped) : grouped

		let vnode
		if (attr === undefined) {
			vnode = h(comp)
		} else if (!children.length) {
			vnode = h(comp, props)
		} else {
			vnode = h(comp, props, children)
		}

		if (directives?.length) {
			const resolved = directives
				.map(d => {
					const dir = resolveDirective(d.name)
					return dir ? ([dir, d.value] as const) : null
				})
				.filter((entry): entry is [object, any] => entry !== null)

			if (resolved.length) {
				return withDirectives(vnode, resolved)
			}
		}

		return vnode
	}
}

const rootAttributes = [
	'staticClass',
	'class',
	'style',
	'key',
	'ref',
	'refInFor',
	'slot',
	'scopedSlots',
	'model'
]

const prefixedRE = /^(on|nativeOn|props|domProps|hook|v)([A-Z][a-zA-Z]+)?$/

const getRawName = (name: string): string => {
	return name.replace(/^(on|native(On|-on)|props|dom(Props|-props)|hook|v)-?/, '')
}

const makeArray = (a: any): any[] => {
	return Array.isArray(a) ? a : [a]
}

const mergeFn = (
	fn1: (...argz1: any[]) => void,
	fn2: (...argz2: any[]) => void
): ((...argz: any[]) => void) =>
	function (this: any, ...argzMain: any[]) {
		fn1 && fn1.apply(this, argzMain)
		fn2 && fn2.apply(this, argzMain)
	}

const merge = (a: any, b: any): any => {
	if (a === undefined) {
		return b
	}
	if (typeof a === 'function' && typeof b === 'function') {
		return mergeFn(a, b)
	}
	return makeArray(a).concat(b)
}

export const concatenate = (
	src: { [key: string]: any },
	...otherObj: { [key: string]: any }[]
): { [key: string]: any } => {
	src = src || {}
	otherObj.forEach(obj => {
		Object.keys(obj).forEach((key: string) => {
			src[key] = merge(src[key], obj[key])
		})
	})
	return src
}

const handleVModel = (attrsIn: { [key: string]: any }): void => {
	Object.keys(attrsIn)
		.filter(key => key.startsWith('vModel') || key.startsWith('v-model'))
		.forEach(key => {
			const valueRef = attrsIn[key]
			const rootKey = key.startsWith('vModel:')
				? key.slice(7)
				: key.startsWith('v-model')
				? key.slice(8)
				: 'modelValue'
			attrsIn[rootKey] = valueRef
			attrsIn[`onUpdate:${rootKey}`] = ($event: any) => (valueRef = $event)
			delete attrsIn[key]
		})
}

const groupBubleAttrs = (attrsIn: { [key: string]: any }): { [key: string]: any } => {
	const attrsOut: { [key: string]: any } = {}
	Object.keys(attrsIn).forEach(name => {
		const value = attrsIn[name]
		const ccName = camelCase(name)
		if (rootAttributes.indexOf(ccName) > 0) {
			attrsOut[ccName] = value
		} else if (name === 'attrs') {
			attrsOut.attrs = concatenate(attrsOut.attrs, value)
		} else if (prefixedRE.test(ccName)) {
			const foundName = prefixedRE.exec(ccName)
			if (foundName) {
				const prefix = foundName[1]
				const rawName = getRawName(name)
				const camelCasedName = rawName.length ? rawName[0].toLowerCase() + rawName.slice(1) : ''
				if (prefix === 'v') {
					if (!attrsOut.directives) {
						attrsOut.directives = []
					}
					attrsOut.directives.push({
						name: camelCasedName,
						value
					})
				} else {
					if (!attrsOut[prefix]) {
						attrsOut[prefix] = {}
					}
					if (camelCasedName.length) {
						attrsOut[prefix][camelCasedName] = merge(attrsOut[prefix][camelCasedName], value)
					} else {
						concatenate(attrsOut[prefix], value)
					}
				}
			}
		} else {
			attrsOut.attrs = attrsOut.attrs || {}
			const finalName = /^data-/.test(name) ? name : ccName
			attrsOut.attrs[finalName] = value
		}
	})
	return attrsOut
}

const toVue3EventName = (eventName: string): string =>
	`on${eventName[0].toUpperCase()}${eventName.slice(1)}`

const flattenForVue3 = (grouped: { [key: string]: any }): { [key: string]: any } => {
	const attrsOut: { [key: string]: any } = {}

	rootAttributes.forEach(key => {
		if (grouped[key] !== undefined) {
			attrsOut[key] = grouped[key]
		}
	})

	;['attrs', 'domProps', 'props'].forEach(key => {
		if (grouped[key]) {
			Object.assign(attrsOut, grouped[key])
		}
	})

	;['on', 'nativeOn'].forEach(prefix => {
		if (grouped[prefix]) {
			Object.keys(grouped[prefix]).forEach(eventName => {
				attrsOut[toVue3EventName(eventName)] = grouped[prefix][eventName]
			})
		}
	})

	if (grouped.hook) {
		const hookMap: { [key: string]: string } = {
			insert: 'onVnodeMounted',
			prepatch: 'onVnodeBeforeUpdate',
			postpatch: 'onVnodeUpdated',
			destroy: 'onVnodeUnmounted'
		}
		Object.keys(grouped.hook).forEach(hookName => {
			const vue3Hook = hookMap[hookName] || `onVnode${hookName[0].toUpperCase()}${hookName.slice(1)}`
			attrsOut[vue3Hook] = grouped.hook[hookName]
		})
	}

	if (grouped.directives) {
		attrsOut.directives = grouped.directives
	}

	return attrsOut
}

const groupAttr = (attrsIn: { [key: string]: any }): { [key: string]: any } | undefined => {
	if (!attrsIn) {
		return undefined
	}

	handleVModel(attrsIn)
	return flattenForVue3(groupBubleAttrs(attrsIn))
}
