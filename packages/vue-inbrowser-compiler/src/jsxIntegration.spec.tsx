/* eslint-disable no-new-func */
import { vi } from 'vitest'
import { h } from 'vue'
import { transform } from 'buble'
import { adaptCreateElement, concatenate } from 'vue-inbrowser-compiler-utils'
import { shallowMount, mount } from '@vue/test-utils'

describe('integration', () => {
	describe('from JSX', () => {
		const getComponent = (
			code: string,
			params: { [key: string]: any } = {}
		): { [key: string]: any } => {
			const compiledCode = transform('const ___ = ' + code, {
				jsx: '__pragma__(h)',
				objectAssign: 'concatenate'
			}).code
			const [param1, param2, param3, param4] = Object.keys(params)
			const getValue = new Function(
				'__pragma__',
				'concatenate',
				'h',
				param1,
				param2,
				param3,
				param4,
				compiledCode + ';return ___;'
			)
			return getValue(
				adaptCreateElement,
				concatenate,
				h,
				params[param1],
				params[param2],
				params[param3],
				params[param4]
			)
		}

		test('Contains text', () => {
			const wrapper = shallowMount(
				getComponent(`{
				render() {
				  return <div>test</div>
				},
			  }`)
			)

			expect(wrapper.element.tagName).toBe('DIV')
			expect(wrapper.text()).toBe('test')
		})

		test('Binds text', () => {
			const text = 'foo'
			const wrapper = shallowMount(
				getComponent(
					`{
					render() {
						return <div>{text}</div>
					}
				}`,
					{ text }
				)
			)

			expect(wrapper.element.tagName).toBe('DIV')
			expect(wrapper.text()).toBe('foo')
		})

		test('Extracts attrs', () => {
			const wrapper = shallowMount(
				getComponent(`{
					render() {
					  return <div id="hi" dir="ltr" />
					},
				  }`)
			)

			expect(wrapper.element.id).toBe('hi')
			expect(wrapper.element.getAttribute('dir')).toBe('ltr')
		})

		test('Binds attrs', () => {
			const hi = 'foo'
			const wrapper = shallowMount(
				getComponent(
					`{
					render() {
					  return <div id={hi} />
					},
				  }`,
					{ hi }
				)
			)

			expect(wrapper.element.id).toBe('foo')
		})

		test('Omits attrs if possible', () => {
			const wrapper = shallowMount(
				getComponent(`{
					render() {
					  return <div>test</div>
					},
				  }`)
			)

			expect(wrapper.element.getAttribute('id')).toBeNull()
		})

		test('Omits children if possible', () => {
			const wrapper = shallowMount(
				getComponent(`{
				render() {
				  return <div/>
				}
			  }`)
			)

			expect(wrapper.element.childNodes.length).toBe(0)
		})

		test('Handles top-level special attrs', () => {
			const wrapper = shallowMount(
				getComponent(`{
					render() {
						return <div class="foo" style="color: red" />
					}
				  }`)
			)
			expect(wrapper.classes()).toContain('foo')
			expect((wrapper.element as HTMLElement).style.color).toBe('red')
		})

		test('Handles nested properties (camelCase)', () => {
			const noop = (_: any) => _
			const wrapper = shallowMount(
				getComponent(
					`{
			  render() {
				return (
				  <div domPropsInnerHTML="<p>hi</p>" onClick={noop} />
				)
			  },
			}`,
					{ noop }
				)
			)
			expect(wrapper.html()).toContain('<p>hi</p>')
		})

		test('Supports data attribute', () => {
			const wrapper = shallowMount(
				getComponent(`{
			  render() {
				return <div data-id="1" />
			  },
			}`)
			)

			expect(wrapper.attributes('data-id')).toBe('1')
		})

		test('Handles identifier tag name as components', () => {
			const Test = { render: () => null }
			const wrapper = shallowMount(
				getComponent(
					`{
			  render() {
				return <Test />
			  },
			}`,
					{ Test }
				)
			)

			expect(wrapper.html()).toContain('test-stub')
		})

		test('Works for components with children', () => {
			const Test = {
				render() {
					return <div><slot /></div>
				}
			}
			const wrapper = mount(
				getComponent(
					`{
				render() {
					return (
						<Test>
							<div>hi</div>
						</Test>
					)
				}
			}`,
					{ Test }
				)
			)
			expect(wrapper.text()).toBe('hi')
		})

		test('Binds things in thunk with correct this context', () => {
			const Test = getComponent(`{
				render() {
					return <div><slot /></div>
				}
			}`)
			const wrapper = mount(
				getComponent(
					`{
			  data: () => ({ test: 'foo' }),
			  render() {
				return <Test>{this.test}</Test>
			  },
			}`,
					{ Test }
				)
			)

			expect(wrapper.html()).toBe('<div>foo</div>')
		})

		test('Spread (single object expression)', () => {
			const props = {
				hello: 2
			}
			const wrapper = shallowMount(
				getComponent(
					`{
			  render() {
				return <div {... { props } } />
			  },
			}`,
					{ props }
				)
			)

			expect(wrapper.attributes('hello')).toBe('2')
		})

		test('Spread (mixed)', () => {
			const calls: number[] = []
			const data = {
				attrs: {
					id: 'hehe'
				},
				on: {
					click() {
						calls.push(3)
					}
				},
				props: {
					innerHTML: 2
				},
				hook: {
					insert() {
						calls.push(1)
					}
				},
				class: ['a', 'b']
			}
			const wrapper = shallowMount(
				getComponent(
					`{
			  render() {
				return (
				  <div
					href="huhu"
					{...data}
					class={{ c: true }}
					on-click={() => calls.push(4)}
					hook-insert={() => calls.push(2)}
				  />
				)
			  },
			}`,
					{ data, calls }
				)
			)

			expect(wrapper.attributes('id')).toBe('hehe')
			expect(wrapper.attributes('href')).toBe('huhu')
			expect(wrapper.classes()).toEqual(expect.arrayContaining(['a', 'b', 'c']))
			expect(calls).toEqual([1, 2])
			wrapper.trigger('click')
			expect(calls).toEqual([1, 2, 3, 4])
		})

		test('Custom directives', () => {
			const mounted = vi.fn()
			const directive = { mounted }

			shallowMount(
				getComponent(
					`{
				render() {
					return <div v-test={123} vOther={234} />
				}
			}`
				),
				{
					global: {
						directives: {
							test: directive,
							other: directive
						}
					}
				}
			)

			expect(mounted).toHaveBeenCalledTimes(2)
		})

		test('xlink:href', () => {
			const wrapper = shallowMount(
				getComponent(
					`{
			  render() {
				return <use xlinkHref={'#name'} />
			  },
			}`
				)
			)

			expect(wrapper.element.getAttributeNS('http://www.w3.org/1999/xlink', 'href')).toBe(
				'#name'
			)
		})
		test('Merge class', () => {
			const wrapper = shallowMount(
				getComponent(
					`{
				render() {
					return <div class="a" {...{ class: 'b' }} />
				}
			}`
				)
			)

			expect(wrapper.classes()).toEqual(expect.arrayContaining(['a', 'b']))
		})

		test('JSXMemberExpression', () => {
			const a = {
				b: {
					cmp: getComponent(
						`{
						render() {
							return <div />
						}
					}`
					)
				}
			}
			const wrapper = mount(
				getComponent(
					`{
			  render() {
				return <a.b.cmp />
			  },
			}`,
					{ a }
				)
			)

			expect(wrapper.html()).toBe('<div></div>')
		})
	})
})
