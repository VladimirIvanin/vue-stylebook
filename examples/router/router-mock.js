import { h } from 'vue'

export default app => {
	app.component('RouterLink', {
		props: {
			tag: { type: String, default: 'a' }
		},
		render() {
			const href = this.$attrs.to
			return h(
				this.tag,
				{
					href,
					onClick(e) {
						// eslint-disable-next-line no-console
						console.log('Navigated to: ', href)
						e.preventDefault()
					}
				},
				this.$slots.default?.()
			)
		}
	})
}
