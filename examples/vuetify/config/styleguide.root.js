import { h } from 'vue'
import Languages from './Languages.vue'

export default previewComponent => ({
	render() {
		return h('v-app', [h(Languages), h(previewComponent)])
	}
})
