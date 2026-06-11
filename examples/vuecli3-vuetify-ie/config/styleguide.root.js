import { h } from 'vue'
import Languages from './Languages.vue'
import './global.scss'

export default previewComponent => ({
	render() {
		return h('v-app', { id: 'v-app' }, [h(Languages), h(previewComponent)])
	}
})
