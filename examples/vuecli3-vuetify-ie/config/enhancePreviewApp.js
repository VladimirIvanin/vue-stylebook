import { createI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import messages from './i18n'

const vuetify = createVuetify({ components, directives })

const i18n = createI18n({
	legacy: true,
	locale: 'en',
	messages
})

export default app => {
	app.use(vuetify)
	app.use(i18n)
}
