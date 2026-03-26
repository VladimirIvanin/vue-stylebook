import { createApp } from 'vue-inbrowser-compiler-utils'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueAppFactory() {
	return (component: any, el: HTMLElement, enhancePreviewApp: (app: any) => void) => {
		const app = createApp(component)
		enhancePreviewApp(app)
		registerGlobalComponents(app)
		app.mount(el)
		return app
	}
}
