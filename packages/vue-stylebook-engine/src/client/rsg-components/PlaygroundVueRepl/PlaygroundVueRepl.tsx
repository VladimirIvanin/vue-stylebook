import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PlaygroundRenderer from 'react-styleguidist/lib/client/rsg-components/Playground/PlaygroundRenderer'
import Styled, { JssInjectedProps } from 'rsg-components/Styled'
import PlaygroundError from 'rsg-components/PlaygroundError'
import { useStyleGuideContext } from 'rsg-components/Context'
import { SanitizedStyleguidistConfig } from '../../../types/StyleGuide'
import { normalizeCode } from './normalizeCode'

const PlaygroundRendererAny = PlaygroundRenderer as any

const styles = () => ({
	root: {
		width: '100%'
	}
})

type PlaygroundVueReplInnerProps = JssInjectedProps & {
	code: string | { raw?: string }
	settings?: { [key: string]: any }
	config: SanitizedStyleguidistConfig
}

type PlaygroundVueReplInnerState = {
	error: string | null
}

class PlaygroundVueReplInner extends Component<
	PlaygroundVueReplInnerProps,
	PlaygroundVueReplInnerState
> {
	public static propTypes = {
		classes: PropTypes.objectOf(PropTypes.string.isRequired).isRequired,
		code: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
		settings: PropTypes.object,
		config: PropTypes.object.isRequired
	}

	public state: PlaygroundVueReplInnerState = {
		error: null
	}

	private mountNode: HTMLDivElement | null = null
	private vueApp: any = null
	private distRebuiltListener: (() => void) | null = null

	public componentDidMount() {
		this.distRebuiltListener = () => this.mountRepl()
		window.addEventListener('vsg:dist-rebuilt', this.distRebuiltListener)
		this.mountRepl()
	}

	public componentDidUpdate(prevProps: PlaygroundVueReplInnerProps) {
		if (normalizeCode(prevProps.code) !== normalizeCode(this.props.code)) {
			this.mountRepl()
		}
	}

	public componentWillUnmount() {
		if (this.distRebuiltListener) {
			window.removeEventListener('vsg:dist-rebuilt', this.distRebuiltListener)
			this.distRebuiltListener = null
		}
		this.unmountRepl()
	}

	private unmountRepl() {
		if (this.vueApp) {
			this.vueApp.unmount?.()
			this.vueApp = null
		}
	}

	private mountRepl = async () => {
		if (!this.mountNode) {return}

		this.unmountRepl()
		this.setState({ error: null })

		const inputCode = normalizeCode(this.props.code).trim()
		const appVue = inputCode || '<template><div /> </template>'

		try {
			const vueModule = await import('vue')
			// eslint-disable-next-line import/no-unresolved
			const replModule = await import('@vue/repl')
			// eslint-disable-next-line import/no-unresolved
			const editorModule = await import('@vue/repl/codemirror-editor')
			const { createApp, defineComponent, h, ref } = vueModule as any
			const { Repl, useStore, useVueImportMap, mergeImportMap } = replModule as any
			const CodeMirror = (editorModule as any).default

			const runtimeDev = process.env.VSG_VUE_REPL_RUNTIME_DEV_URL
			const runtimeServerRenderer = process.env.VSG_VUE_REPL_SERVER_RENDERER_URL
			const isDev = process.env.STYLEGUIDIST_ENV === 'development'

			const rootComponent = defineComponent({
				name: 'VsgVueReplRoot',
				setup() {
					const replRef = ref(null as any)
					const { importMap: builtinImportMap, vueVersion } = useVueImportMap()
					const store = useStore({ builtinImportMap, vueVersion })

					if (isDev && runtimeDev) {
						store.setImportMap(
							mergeImportMap(store.getImportMap(), {
								imports: {
									vue: runtimeDev,
									...(runtimeServerRenderer
										? { 'vue/server-renderer': runtimeServerRenderer }
										: {})
								}
							})
						)
					}

					store.setFiles({
						...store.getFiles(),
						'App.vue': appVue
					})

					return () =>
						h(Repl, {
							ref: replRef,
							editor: CodeMirror,
							store,
							clearConsole: false,
							showCompileOutput: true,
							editorOptions: {
								autoSaveText: false,
								showErrorText: false
							}
						})
				}
			})

			this.vueApp = createApp(rootComponent)
			this.vueApp.mount(this.mountNode)
		} catch (err: any) {
			this.setState({
				error:
					err?.message ||
					'Failed to initialize Vue REPL. Install Vue 3 and @vue/repl dependencies.'
			})
		}
	}

	public render() {
		const { classes } = this.props
		const { error } = this.state

		return (
			<PlaygroundRendererAny
				exampleTab={
					<div className={classes.root}>
						<div ref={ref => (this.mountNode = ref)} />
						{error && <PlaygroundError message={error} />}
					</div>
				}
				codeTab={<div />}
				tabButtons={[]}
			/>
		)
	}
}

type PlaygroundVueReplProps = Omit<PlaygroundVueReplInnerProps, 'config'>

function PlaygroundVueRepl(props: PlaygroundVueReplProps) {
	const { config } = useStyleGuideContext() as any as { config: SanitizedStyleguidistConfig }
	return <PlaygroundVueReplInner {...props} config={config} />
}

export default Styled<PlaygroundVueReplProps>(styles as any)(PlaygroundVueRepl)
