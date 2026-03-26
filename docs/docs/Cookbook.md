# Практические сценарии

<!-- содержание -->

- [Как добавить сторонние плагины в Styleguidist?](#как-добавить-сторонние-плагины-в-styleguidist)
- [Как добавить Vuex в Styleguidist?](#как-добавить-vuex-в-styleguidist)
- [Как добавить тестовые данные в Styleguidist?](#как-добавить-тестовые-данные-в-styleguidist)
- [Как исключить некоторые компоненты из Styleguidist?](#как-исключить-некоторые-компоненты-из-styleguidist)
- [Как скрыть некоторые компоненты в Styleguidist, но оставить их доступными в примерах?](#как-скрыть-некоторые-компоненты-в-styleguidist-но-оставить-их-доступными-в-примерах)
- [Как добавить собственный JavaScript и CSS или полифилы?](#how-to-add-custom-javascript-and-css-or-polyfills)
- [Как изменить стили Styleguidist?](#how-to-change-styles-of-a-style-guide)
- [Как изменить вывод журналов сервера разработки Styleguidist?](#how-to-change-style-guide-dev-server-logs-output)
- [Как отлаживать мои компоненты и примеры?](#как-отладить-мои-компоненты-и-примеры)
- [Как отлаживать исключения, выбрасываемые моими компонентами?](#как-отлаживать-исключения-выбрасываемые-моими-компонентами)
- [Как использовать Vagrant со Styleguidist?](#как-использовать-vagrant-со-styleguidist)
- [Как документировать стилизованные компоненты?](#как-документировать-стилизованные-компоненты)
- [Как использовать Vue Styleguidist с компонентами, содержащими маршрутизацию](#как-использовать-vue-styleguidist-с-компонентами-содержащими-маршрутизацию)
- [Как включить FontAwesome (или другие наборы иконок) в Styleguidist](#как-включить-fontawesome-или-другие-наборы-иконок-в-styleguidist)
- [Как использовать Vue Styleguidist с несколькими пакетами компонентов](#как-использовать-vue-styleguidist-с-несколькими-пакетами-компонентов)
- [У меня есть несколько компонентов в одной папке, что мне делать?](#я-есть-несколько-компонентов-в-одной-папке-что-могу-я-сделать)
- [Как интегрировать Styleguidist в существующий сайт Nuxtjs?](#как-интегрировать-styleguidist-в-существующий-сайт-nuxtjs)
- [Как использовать имя компонента в примерах с другим отображаемым именем](#как-использовать-имя-компонента-в-примерах-с-другим-отображаемым именем)

<!-- tocstop -->

## Как добавить сторонние плагины в Styleguidist?

Styleguidist не загружает файл `main.js`. Чтобы установить плагины и библиотеки компонентов, подключите их отдельно.

### Vue 3

Сначала создайте файл `.js`, который установит плагины в существующее приложение Vue. Затем добавьте его в параметр [enhancePreviewApp](/Configuration.md#enhancePreviewApp) файла `styleguide.config.js`:

`styleguide.config.js`

```javascript
module.exports = {
  enhancePreviewApp: [path.join(__dirname, 'styleguide/global.requires.js')]
}
```

`styleguide/global.requires.js`

```javascript
import VCalendar from "v-calendar"
import "v-calendar/style.css"

export default function (app) {
  app.use(VCalendar, {})
}
```


### Vue 2

Сначала создайте файл `.js`, который устанавливает плагины. Затем добавьте его в параметр [require](/Configuration.md#require) файла `styleguide.config.js`:

`styleguide.config.js`

```javascript
module.exports = {
  require: [path.join(__dirname, 'styleguide/global.requires.js')]
}
```

`styleguide/global.requires.js`

```javascript
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
// import full version fo vuetify (see NOTE)
import Vuetify from 'vuetify'
// get the exported options from the plugin to avoid rewriting them
import { opts } from '../src/plugins/vuetify'

Vue.use(VueI18n)
Vue.use(VeeValidate)
Vue.use(Vuetify, opts)
```

### Изменение корневого компонента примеров предварительного просмотра

Если вам нужно изменить корневой компонент каждого из вариантов предварительного просмотра, вы можете изменить корневой компонент предварительного просмотра. Создание файла `.js`, который экспортирует корневой компонент как [компонент jsx](https://vuejs.org/v2/guide/render-function.html), а затем добавляет его в файл `styleguide.config.js`.

Используйте опцию [renderRootJsx](/Configuration.md#renderrootjsx):

```javascript
// config/styleguide.root.js
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import messages from './i18n'

const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default previewComponent => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    i18n,
    // let's not forget to add all necessary info to
    // each vue app root about vuetify
    vuetify: new Vuetify(),
    render(createElement) {
      // v-app to support vuetify plugin
      return createElement('v-app', [createElement(previewComponent)])
    }
  }
}
```

```javascript
// styleguide.config.js
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

См. пример [style guide with vuetify and vue-i18n](https://github.com/vue-styleguidist/vue-styleguidist/tree/delivery/examples/vuetify).

**Примечание:** поскольку Styleguidist использует отдельный корневой инстанс для каждого примера, стандартная установка Vuetify может не сработать. Рекомендуется глобальная регистрация, как показано выше.

## Как добавить Vuex в Styleguidist?

Создайте `.js`-файл, подключите Vuex и укажите его в `styleguide.config.js`.

```javascript
// config/styleguide.root.js
import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations, getters } from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default previewComponent => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    store,
    render(createElement) {
      return createElement(previewComponent)
    }
  }
}
```

Используйте опцию [require](/Configuration.md#require):

```javascript
// styleguide.config.js
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

См. пример [style guide with vuex](https://github.com/vue-styleguidist/vue-styleguidist/tree/delivery/examples/vuex).

## Как добавить тестовые данные в Styleguidist?

Можно использовать [global mixins](https://vuejs.org/v2/guide/mixins.html#Global-Mixin) для добавления тестовых данных:

Используйте опцию [require](/Configuration.md#require):

```javascript
// styleguide/global.requires.js
import Vue from 'vue'

Vue.mixin({
  data() {
    return {
      colorDemo: 'blue',
      sizeDemo: 'large'
    }
  }
})
```

```javascript
// styleguide.config.js
module.exports = {
  require: [path.join(__dirname, 'styleguide/global.requires.js')]
}
```

```jsx
// example component

<Button size="colorDemo" color="sizeDemo">
  Click Me
</Button>
```

## Как исключить некоторые компоненты из Styleguidist?

Vue Styleguidist по умолчанию игнорирует тесты (папка `__tests__`).

Используйте опцию [ignore](/Configuration.md#ignore), чтобы настроить такое поведение:

```javascript
module.exports = {
  ignore: ['**/*.spec.vue', '**/components/Button.vue']
}
```

> **Примечание.** Используйте glob-шаблоны, например `**/components/Button.vue` вместо `components/Button.vue`.

## Как скрыть некоторые компоненты в Styleguidist, но оставить их доступными в примерах?

- Если мы не используем [locallyRegisterComponents](/Configuration.md#locallyregistercomComponents), все документированные компоненты доступны в каждом примере. Если мы создадим компоненты из боковой панели и документации, используя конфигурацию [ignore](/Configuration.md#ignore), они получатся для примера. Используйте опцию [require](/Configuration.md#require), чтобы загрузить файл, в котором мы будем регистрировать наши скрытые компоненты.

### Конкретный пример:

**Проблема:** Я не хочу документировать ни один компонент, имя файла которого начинается с подчеркивания (`_`).

```js
module.exports = {
  // load install.components.js for every page and example
  require: ['./docs/install.components.js'],
  // register all the components
  components: 'src/components/**/*.vue',
  // avoid documenting components that start with _
  ignore: ['**/_*.vue']
}
```

Если вы начали с `vue-cli` или только что установили Styleguidist, файла `docs/install.components.js` в проекте может не быть.

> **ПРИМЕЧАНИЕ** `docs/install.components.js` выше — это имя файла, который мы выбрали. Не важно, какое имя вы выберете, поэтому выберите то, которое имеет для вас смысл.

Сначала мы создаем `docs/install.components.js`. Затем мы будем использовать функцию узла 6 require (или require.context, поскольку мы находимся в двадцатом веб-пакете), чтобы собрать компоненты, которые мы хотим использовать в примерах.

Наконец, мы регистрируем их с помощью функции `Vue.component()`.

Компоненты, начинающиеся с подчеркивания, теперь доступны в каждом примере (без подчеркивания).

```js
import Vue from 'vue'
import * as path from 'path'

const registerAllComponents = components => {
  // For each matching file name...
  components.keys().forEach(fileName => {
    // Get the component config
    const componentConfig = components(fileName)

    // get the component name from the object
    const componentName =
      componentConfig.default.name ||
      componentConfig.name ||
      // or from the filename, removing any character
      // that would not fit in a component name
      path.basename(fileName, '.vue').replace(/[^0-9a-zA-Z]/, '')

    // Globally register the component
    Vue.component(
      componentName,
      componentConfig.default || componentConfig
    )
  })
}

// register all components with a file name starting with _
registerAllComponents(
  require.context('../src/', true, /[\\/]_.+\.vue$/)
)
```

## Как добавить собственный JavaScript, CSS или полифилы?

В вашей конфигурации Styleguidist:

```javascript
const path = require('path')
module.exports = {
  require: [
    'babel-polyfill',
    path.join(__dirname, 'path/to/script.js'),
    path.join(__dirname, 'path/to/styles.css')
  ]
}
```

## Как изменить стили Styleguidist?

Для настройки интерфейса Styleguidist используйте две опции: [theme](/Configuration.md#theme) и [styles](/Configuration.md#styles).

Используйте [theme](/Configuration.md#theme), чтобы изменить шрифты, цвета и т. д. д. д. д.

Используйте [styles](/Configuration.md#styles) для настройки стиля любого компонента Styleguidist.

В качестве примера:

```javascript
module.exports = {
  theme: {
    color: {
      link: 'firebrick',
      linkHover: 'salmon'
    },
    fontFamily: {
      base: '"Comic Sans MS", "Comic Sans", cursive'
    }
  },
  styles: {
    Logo: {
      // We're changing the LogoRenderer component
      logo: {
        // We're changing the rsg--logo-XX class name inside the component
        animation: 'blink ease-in-out 300ms infinite'
      },
      '@keyframes blink': {
        to: { opacity: 0 }
      }
    }
  }
}
```

> **Примечание:** См. доступный [theme variables](https://github.com/Styleguidist/react-Styleguidist/blob/master/src/client/styles/theme.ts).

> **Примечание.** В стилях используется [JSS](https://github.com/cssinjs/jss/blob/master/docs/jss-syntax.md) с учетом плагинов: [jss-isolate](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-isolate), [jss-nested](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-nested), [jss-camel-case](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-camel-case), [jss-default-unit](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-default-unit), [jss-compose](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-compose) и [jss-global](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-global).

> **Примечание.** Используйте [React Developer Tools](https://github.com/facebook/react) для поиска названных компонентов и стилей. Например, компонент `<LogoRenderer><h1 className="rsg--logo-53">` соответствует приведенному выше примеру.

> **Примечание.** Используйте функцию вместо объекта для [styles](/Configuration.md#styles), чтобы получить доступ ко всем переменным темам в ваших обычных стилях.

```javascript
module.exports = {
  styles: function (theme) {
    return {
      Logo: {
        logo: {
          // we can now change the color used in the logo item to use the theme's `link` color
          color: theme.color.link
        }
      }
    }
  }
}
```

> ПРИМЕЧАНИЕ. Если нужно сослаться на исходный компонент, импортируйте версию `rsg-components-default`. Например, [customized](https://github.com/vue-styleguidist/vue-styleguidist/tree/delivery/examples/customized) использует следующий подход:

```jsx
// SectionsRenderer.js
import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'rsg-components/Styled'
import Heading from 'rsg-components/Heading'

// Avoid circular ref
// Import default implementation using `rsg-components-default`
import DefaultSectionsRenderer from 'rsg-components-default/Sections/SectionsRenderer'

const styles = ({ fontFamily, color, space }) => ({
  headingSpacer: {
    marginBottom: space[2]
  },
  descriptionText: {
    marginTop: space[0],
    fontFamily: fontFamily.base
  }
})

export function SectionsRenderer({ classes, children }) {
  return (
    <div>
      {!!children.length && (
        <div className={classes.headingSpacer}>
          <Heading level={1}>Example Components</Heading>
          <p className={classes.descriptionText}>
            These are the greatest components
          </p>
        </div>
      )}
      <DefaultSectionsRenderer>{children}</DefaultSectionsRenderer>
    </div>
  )
}

SectionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default Styled(styles)(SectionsRenderer)
```

## Как изменить вывод логов dev-сервера Styleguidist?

Вы можете изменить формат журналов сервера разработки веб-пакета, изменив параметр `stats` конфигурации веб-пакета:

```javascript
module.exports = {
  webpackConfig(env) {
    if (env === 'development') {
      return {
        stats: {
          chunks: false,
          chunkModules: false,
          chunkOrigins: false
        }
      }
    }
    return {}
  }
}
```

## Как отлаживать мои компоненты и примеры?

1. Откройте инструменты разработчика вашего браузера.
2. Напишите оператору `debugger;`, где вы хотите: в исходном коде компонента, в формате Markdown или даже в редакторе браузера.

## Как отладить исключения, возникающие из моих компонентов?

1. Поместите оператора `debugger;` в начало вашего кода. Нажмите кнопку ![Отладчик](https://d3vv6lp55qjaqc.cloudfront.net/items/2h2q3N123N3G3R252o41/debugger.png) в инструментах разработчика вашего браузера. Нажмите кнопку ![Продолжить](https://d3vv6lp55qjaqc.cloudfront.net/items/3b3c1P3g3O1h3q111I2l/continue.png) и отладчик заблокирует запуск JavaScript в браузере при следующем отключении.

## Как использовать Vagrant со Styleguidist?

Сначала прочитайте [Vagrant guide](https://webpack.js.org/guides/development-vagrant/) из документации веб-пакета. Затем опрос в конфигурации вашего веб-пакета:

```js
devServer: {
  watchOptions: {
    poll: true
  }
}
```

## Как документировать стилизованные компоненты?

Чтобы документировать стилизованные компоненты, вам необходимо, чтобы они распознавали vue-docgen-api. Самый простой способ — использовать расширения:

```js
import styled from 'vue-styled-components'

const _StyledTitle = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

export default {
  extends: _StyledTitle
}
```

или если вы используете синтаксис компонента класса

```js
import styled from 'vue-styled-components'

const _StyledTitle = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

@Components({ extends: _StyledTitle })
export default class StyledTitle extends Vue {}
```

## Как использовать Vue Styleguidist с компонентами, содержащими маршрутизацию?

Если ваши компоненты содержат `<router-link>`, в примерах Styleguidist лучше
подменить его упрощенным компонентом. Для этого добавьте файл
`styleguide.global.requires.js` (пример ниже) и подключите его через опцию
[require](/Configuration.md#require). Не подключайте `vue-router` напрямую
внутри Styleguidist.

```js
// styleguide.global.requires.js
import Vue from 'vue'
Vue.component('RouterLink', {
  props: {
    tag: { type: String, default: 'a' }
  },
  render(createElement) {
    return createElement(this.tag, {}, this.$slots.default)
  }
})
```

См. [этот пример](/Examples#router) для полной реализации.

> **Совет:** если в браузерной консоли видны ошибки `.resolve`, скорее всего,
> где-то все еще подключается `vue-router`.
>
> 1. Найдите все вхождения `Vue.use(Router)` в кодовой базе.
> 2. Добавьте перед ними `console.trace()`, чтобы увидеть стек вызовов.
> 3. Уберите лишнее подключение роутера из кода, используемого в примерах.
>
> Если полностью убрать подключение нельзя, можно включать его условно:
> установите пакет `cross-env`, запускайте Styleguidist как
> `cross-env MYSTYLE=true styleguide serve` и проверяйте переменную в коде.
```js
> if (!process.env.MYSTYLE) {
>   Vue.use(Router)
> }
> ```

## Как включить FontAwesome (или другие наборы иконок) в Styleguidist?

Если ваши компоненты используют набор значков, например FontAwesome, вы можете отредактировать `styleguide.config.js`, чтобы импортировать его:

```js
module.exports = {
  title: "Мой Styleguidist",
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href:
            'https://pro.fontawesome.com/releases/v5.8.2/css/all.css',
          integrity: 'your hash here',
          crossorigin: 'anonymous'
        }
      ]
    }
  }
}
```

Дополнительную информацию см. в [template](/Configuration.md#template).

## Как использовать Vue Styleguidist с несколькими пакетами компонентов?

Если ваши базовые компоненты находятся в одном пакете, а производные компоненты — в другом, вам нужно, чтобы документация отражала реквизиты расширенных компонентов в открытых.

Допустим, у вас есть `BaseButton.vue` в пакете `@scoped/core`, который расширяется до `IconButton.vue` в пакете `@scoped/extended`, реквизиты `BaseButton.vue` не будут документироваться с помощью `IconButton.vue`. Это может быть то, что вы хотите, или вам может не хватать большого количества реквизитов.

Используйте опцию [validExtends](/Configuration.md#validExtends), чтобы разрешить анализ расширенных компонентов в других пакетах.

```javascript
module.exports = {
  // Добавьте следующую функцию в ваш styleguide.config.js
  validExtends (fullFilePath) {
    return (
      /[\\/]@scoped[\\/]core[\\/]/.test(fullFilePath) ||
      !/[\\/]node_modules[\\/]/.test(fullFilePath)
    )
  }
}
```

## У меня есть несколько компонентов в одной папке, что мне делать?

Если несколько документированных компонентов находятся в одной системе и вы используете файл `ReadMe` для их документирования, для каждого компонента будет использоваться основной файл readme.

Доступны три решения в зависимости от вкуса и контекста.

### Блок `<docs>`

Самое простое решение — использовать блок `<docs>`. Он хорошо работает
с подсветкой синтаксиса в Vetur и помогает держать документацию рядом с кодом.

Компромисс: Markdown-файлы удобно читать без рендеринга (например, на GitHub),
а Vue-файлы — нет.

### Именованные файлы Readme

Используйте имя компонента и меняйте расширение `.vue` на `.md`, чтобы иметь
отдельный файл документации для каждого компонента.

Компромисс: GitHub автоматически показывает именно `readme`-файл. Именованные
файлы документации для отдельных компонентов не будут подхватываться автоматически.

### Удаление ненужной документации

[Documenting](/docs/Documenting.html#ignore-examples-files)

В тегах компонента можно указать doclet `@example`. Обычно он используется, чтобы показать, где находится дополнительная документация.

Также можно использовать специальное значение `[none]`. В этом случае связанный
файл примера будет скрыт.

Если для внутренних компонентов указать `@example [none]`, останется только
основной `readme` целевого компонента.

## Как интегрировать Styleguidist в существующий сайт Nuxtjs?

Предполагается, что у вас есть существующий сайт Nuxtjs или вы используете Nuxtjs в качестве среды разработки для своих компонентов библиотеки. Хотя вы также можете побудить пользователей клонировать ваши репозитории и создавать документы, было бы неплохо интегрировать их в существующий сайт Nuxtjs. Это возможно (с некоторыми оговорками).

Сначала определите маршрут, где должна быть документация Styleguidist. Например, `www.mysite.com/docs`. Если бы это была обычная страница Nuxt, это был бы файл `pages/docs.vue`. Поэтому в целевом пути нельзя иметь страницу `pages/<dest>.vue`.

Далее настройте параметры генерации в `nuxt.config.js`. Если вы делаете
deployment на GitLab, это может выглядеть так:

```js
// nuxt.config.js
export default {
  // ...
  генерировать: {
    реж: 'публичный'
  }
  // ...
}
```

Если вы уже генерировали Nuxt-сайт и смотрели результат (например, в каталоге `public`), то знаете, что каждый `pages/<dest>.vue` становится подкаталогом. Поэтому путь для Styleguidist не должен совпадать с `dest.vue`.

Теперь обновите `styleguide.config.js`, чтобы `styleguideDir` соответствовал `generate.dir` из `nuxt.config.js`. Например, если документация должна быть по пути `/docs`, а `generate.dir = "public"`, то используйте `styleguideDir = "public/docs"`.

Далее соблюдайте порядок: сначала сгенерируйте Nuxt (`npm run generate`), затем соберите документацию Styleguidist.

## Как использовать имя компонента в примерах с другим displayName

При использовании `displayName` компоненты в блоке `<docs>` должны быть импортированы с их `displayName` вместо `name`. Это не идеально, поскольку в ваших примерах не используется настоящее имя компонента.

Способ обойти эту проблему — создать компонент-псевдоним с его оригинальным именем.

Изменить [root element](/Configuration.md#renderrootjsx) следующим образом:

```js
// конфигурация/styleguide.root.js
import Vue from 'vue';

export default previewComponent => {
  возвращаться {
    рендер (createElement) {
      вернуть createElement (previewComponent);
    },
    созданный() {
      // Для каждого глобально зарегистрированного компонента
      // создаем псевдоним, если его имя не соответствует его displayName
      Object.entries(Vue.options.comComponents).forEach(c => {
        const displayName = c[0];
        const component = c[1];
        const { name } = component.extendOptions;

        // Если отображаемое имя отличается от имени, создайте псевдоним компонента
        // Пример: displayName компонента AcAlert — Alert
        // Затем мы создаем AcAlert, псевдоним Alert, который будет использоваться в блоке <docs>.
        if (displayName !== имя) {
          Vue.comComponent(имя, компонент);
        }
      });
    },
}
```

```js
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

Теперь вы можете использовать `<AcAlert />` в `<docs>`, пока в левом меню отображается `Alert`.  
Пример:

````vue
<script>
/**
 * Оповещение @displayName
 */
export default {
  название: «АкАлерт»
}
</script>

<template>
  <div>AcAlert</div>
</template>

<docs>
  # Использование ```js
  <АкАлерт />
  <Оповещение
/></документы>
````


> :предупреждение: В меню поиска больше не удается найти `AcAlert`, так как оно ищет по именам страниц, то есть `Alert`.