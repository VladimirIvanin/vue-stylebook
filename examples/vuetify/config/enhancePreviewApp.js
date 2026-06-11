import { createI18n } from 'vue-i18n'
import vuetify from '../src/plugins/vuetify'
import messages from './i18n'

const i18n = createI18n({
	legacy: true,
	locale: 'en',
	messages
})

export default app => {
	app.use(vuetify)
	app.use(i18n)
}
