# Конфигурация

По умолчанию Vue Styleguidist ищет файл `styleguide.config.js` в корне проекта. Путь к файлу конфигурации можно изменить через параметр `--config` в [CLI](/docs/CLI.md).

## `assetsDir`

Тип: `String`, опционально

Папка со статическими ассетами приложения. В dev server style guide она будет доступна по пути `/`.

## `codeSplit`

Тип: `Boolean`, по умолчанию: `true`

По умолчанию vue-styleguidist собирает весь JavaScript в один bundle. Если включить этот флаг, editor (CodeMirror) и compiler будут загружаться отдельными bundle. Каждый из них примерно по 400 KB, что ускоряет первый рендер страницы.

> **Примечание**: Если вы используете эту опцию и у вас в webpack-конфиге есть `babel-loader`, убедитесь, что для него либо исключены `node_modules`, либо подключен [нужный plugin](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import) для code splitting в Babel. Иначе возможна ошибка:
>
> `SyntaxError: Support for the experimental syntax 'dynamicImport' isn't currently enabled`

## `compilerPackage`

Тип: `String`, опционально

Путь или имя модуля, который экспортирует функции `compile` и `getImports`. Этот модуль используется для компиляции live examples. Внутри vue-styleguidist вызывается `require(config.compilerPackage)`, чтобы получить `compile`.
- Реализацию на стороне Node можно посмотреть в [examples-loader.ts](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/packages/vue-styleguidist/src/loaders/examples-loader.ts).
- Использование на frontend можно посмотреть в [Preview.js](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/packages/vue-styleguidist/src/client/rsg-components/Preview/Preview.js).

## `compilerConfig`

Тип: `Object`, по умолчанию: `{ objectAssign: 'Object.assign' }`

Styleguidist использует `vue-inbrowser-compiler` для сборки TypeScript/ES6 модулей на frontend. Эти опции передаются в функцию `compile`.

## `mdxCompileOptions`

Тип: `Object`, по умолчанию: `{}`

Дополнительные опции компиляции, передаваемые в MDX pipeline.

Используйте это поле, чтобы добавить свои `remark` / `rehype` plugins или переопределить `providerImportSource`.

См. также: [MDX](/docs/MDX.md#конфигурация).

## `components`

Тип: `String`, `Function` или `Array`, по умолчанию: `src/components/**/*.vue`

- если `String`: [glob pattern](https://github.com/isaacs/node-glob#glob-primer), который матчится на файлы компонентов;
- если `Function`: функция, возвращающая массив путей модулей;
- если `Array`: массив путей модулей.

Все пути считаются относительно папки с конфигом.

Примеры см. в разделе [Components](/docs/Components.md#components).

## `context`

Тип: `Object`, опционально

Модули, доступные внутри examples. Подходит для утилит (например, Lodash) или тестовых fixture-данных.

```javascript
module.exports = {
  context: {
    map: 'lodash/map',
    users: path.resolve(__dirname, 'fixtures/users')
  }
}
```

После этого их можно использовать в любом example:

```jsx
<Message>{map(users, 'name').join(', ')}</Message>
```

## `contextDependencies`

Тип: `String[]`, опционально

Массив абсолютных путей к директориям, за которыми нужно следить на добавление/удаление компонентов.

По умолчанию Styleguidist использует общую родительскую директорию для всех ваших компонентов.

```javascript
module.exports = {
  contextDependencies: [path.resolve(__dirname, 'lib/components')]
}
```

## `configureServer`

Тип: `Function`, опционально

Функция для добавления endpoint-ов в базовый Express server:

```javascript
module.exports = {
  configureServer(app) {
    // `app` — экземпляр express server, на котором запущен Styleguidist
    app.get('/custom-endpoint', (req, res) => {
      res.status(200).send({ response: 'Server invoked' })
    })
  }
}
```

После этого ваши компоненты смогут обращаться к URL `http://localhost:6060/custom-endpoint` из examples.

## `copyCodeButton`

Тип: `Boolean`, по умолчанию: `false`

Добавляет небольшую кнопку в правом верхнем углу editor, чтобы копировать содержимое кода в clipboard.

## `dangerouslyUpdateWebpackConfig`

Тип: `Function`, опционально

> **Предупреждение:** этой опцией легко сломать Vue Styleguidist. По возможности используйте `webpackConfig`.

Позволяет менять webpack-конфиг без ограничений.

```javascript
module.exports = {
  dangerouslyUpdateWebpackConfig(webpackConfig, env) {
    // WARNING: сначала изучите webpack config Vue styleguidist, иначе можно сломать сборку
    console.log(webpackConfig)
    webpackConfig.externals = {
      jquery: 'jQuery'
    }
    return webpackConfig
  }
}
```

## `defaultExample`

Тип: `Boolean` или `String`, по умолчанию: `false`

Для компонентов без example можно подставлять example по умолчанию. Если поставить `true`, используется [DefaultExample.md](https://github.com/vue-styleguidist/vue-styleguidist/blob/delivery/packages/vue-styleguidist/scripts/templates/DefaultExample.md), либо можно указать путь к собственному Markdown-файлу.

В кастомном default example плейсхолдер `__COMPONENT__` во время компиляции заменяется на имя компонента.

## `displayOrigins`

Тип: `Boolean`, по умолчанию: `false`

Если включено, в таблицах будет видно, где определены `prop`, `event`, `slot` и `method`: в текущем файле или во внешнем mixin/extended component.

Для внешних источников показывается имя компонента, а при наведении — относительный путь к файлу.

## `getComponentPathLine`

Тип: `Function`, по умолчанию: имя файла компонента

Функция, которая возвращает строку пути к компоненту (показывается под названием компонента).

Например, вместо `components/Button/Button.vue` можно выводить `import Button from 'components/Button';`:

```javascript
const path = require('path')
module.exports = {
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.vue')
    const dir = path.dirname(componentPath)
    return `import ${name} from '${dir}';`
  }
}
```

## `editorConfig`

Тип: `Object`, по умолчанию: [scripts/schemas/config.js](https://github.com/vue-styleguidist/vue-styleguidist/blob/delivery/packages/vue-styleguidist/src/scripts/schemas/config.ts#L103-L112)

Опции source code editor. Полный список — в [документации CodeMirror](https://codemirror.net/doc/manual.html#config).

> **Примечание:** начиная с версии 4.0.0 editor по умолчанию — Prism, потому что он значительно легче. Чтобы использовать CodeMirror и эту конфигурацию, отключите [simpleEditor](#simpleEditor).
>
> ```js
> module.exports = {
>   // ...
>   editorConfig: {
>     theme: 'base16-light'
>   },
>   simpleEditor: false
> }
> ```

## `getExampleFilename`

Тип: `Function`, по умолчанию: ищет `Readme.mdx`, `Readme.md`, `ComponentName.mdx` или `ComponentName.md` в папке компонента

Функция, возвращающая путь к файлу examples для указанного пути компонента.

Например, вместо `Readme.md` можно использовать `ComponentName.examples.md`:

```javascript
module.exports = {
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.jsx?$/, '.examples.md')
  }
}
```

Можно возвращать и путь к `.mdx`:

```javascript
module.exports = {
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.vue$/, '.examples.mdx')
  }
}
```

## `storybookBlocks`

Тип: `Boolean`, по умолчанию: `true`

Включает совместимый alias для `@storybook/blocks` в MDX-доках.

Ставьте `false` только если вы предоставляете собственную реализацию/alias.

См. также: [MDX](/docs/MDX.md#совместимость-с-storybook-blocks).

## `enhancePreviewApp`

Тип: `String`, опционально

Позволяет зарегистрировать **global plugins** и **global directives** в preview examples для style guide на **Vue 3**.

Например:

Укажите путь к preview-файлу в `styleguide.config.js`:

```js
// styleguide.config.js
export default {
  // ...
  enhancePreviewApp: path.resolve(__dirname, 'styleguide/preview.js')
}
```

Затем настройте app в этом файле:

```js
// styleguide/preview.js
import { defineEnhanceApp } from 'vue-styleguidist/helpers'
import focusDirective from '../src/directives/v-focus';

// Здесь export ОБЯЗАТЕЛЬНО должен быть default или module.export
// Именно это импортирует styleguide
export default defineEnhanceApp((app) => {
  app.directive('focus', focusDirective)
})
```

> Примечание: если вы используете TypeScript, этот файл тоже может быть на TypeScript.

## `exampleMode`

Тип: `'collapse' | 'hide' | 'expand'`, по умолчанию: `collapse`

Определяет начальное состояние вкладки с кодом example:

- `collapse`: вкладка свернута по умолчанию;
- `hide`: вкладка скрыта и не переключается в UI;
- `expand`: вкладка развернута по умолчанию.

## `ignore`

Тип: `String[]`, по умолчанию: `['**/__tests__/**']`

Массив [glob pattern](https://github.com/isaacs/node-glob#glob-primer), которые не должны попадать в style guide.

> **Примечание:** передавайте именно glob pattern. Например, `**/components/Button.vue`, а не `components/Button.vue`.

## `jssThemedEditor`

Тип: `Boolean`, по умолчанию: `true`

Определяет, должен ли встроенный PrismJS editor стилизоваться через JSS-тему.

Если вы используете CSS-тему, отключите эту опцию и подключите CSS в `require`.

[Репозиторий тем Prism](https://github.com/PrismJS/prism-themes/)

> **Примечание:** у Prism editor есть [известный баг](https://github.com/satya164/react-simple-code-editor/issues/56), из-за которого сложно менять фон и цвет текста напрямую. Обходной путь: если в теме есть
>
> ```css
> pre[class*='language-'] {
>   padding: 1em;
>   margin: 0.5em 0;
>   overflow: auto;
>   background: #1e1e1e;
> }
> ```
>
> используйте `div.prism-editor` для задания фона:
>
> ```css
> pre[class*='language-'] {
>   padding: 1em;
>   margin: 0.5em 0;
>   overflow: auto;
> }
>
> div.prism-editor {
>   background: #1e1e1e;
> }
> ```
>
> Пример см. в [examples/customised](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/examples/customised/styleguide/vsc-prism.css).

## `jsxInComponents`

Тип: `Boolean`, по умолчанию: `true`

Содержат ли ваши компоненты JSX-синтаксис. Иногда синтаксис TypeScript конфликтует с JSX, поэтому бывает полезно отключить опцию. Например, код ниже не распарсится, если флаг не выключен:

```typescript
function initDatepicker() {
  ;(<any>window).$.datetimepicker({
    // babel parser примет `<any>` за jsx
    //...
  })
}
```

## `jsxInExamples`

Тип: `Boolean`, по умолчанию: `false`

Если examples написаны на JSX, эту опцию нужно включить.

```jsx
export default {
  render() {
    return <Button />
  }
}
```

> **Примечание:** при включении этой опции «псевдо-jsx» examples перестанут работать. Examples должны быть написаны в корректном Vue-синтаксисе.

## `logger`

Тип: `Object`, по умолчанию используется `console.*` в CLI или ничего в Node.js API

Кастомные функции логирования:

```javascript
module.exports = {
  logger: {
    // Одно из: info, debug, warn
    // Подавить сообщения
    info: () => {},
    // Переопределить вывод
    warn: message => console.warn(`NOOOOOO: ${message}`)
  }
}
```

## `locallyRegisterComponents`

Тип: `Boolean`, по умолчанию: `false`

По умолчанию `vue-styleguidist` регистрирует все компоненты глобально. Это может быть проблемой, когда:

- несколько компонентов имеют одинаковое имя;
- поведение компонента меняется, если зарегистрирован другой компонент.

В этом случае включите `locallyRegisterComponents: true`. Тогда компоненты будут регистрироваться только в examples своей документации.

Если при этом вам все же нужно подключить дополнительный компонент, действуйте так:

1. Пишите examples в формате SFC.
1. Явно `require`/`import` все нужные компоненты.
1. Регистрируйте их внутри example.

```vue
<script>
import MyButton from './src/components/MyButton.vue'
import MyIcon from './src/components/MyIcon.vue'

export default {
  components: { MyButton, MyIcon }
}
</script>

<template>
  <MyButton><MyIcon name="Save" />Save Form</MyButton>
</template>
```

> **Примечание:** то же самое можно сделать через скрипт с `new Vue()`.

## `minimize`

Тип: `Boolean`, по умолчанию: `true`

Если хотите отключить минификацию в build (например, для дебага или ускорения сборок на PR в Netlify), выключите эту опцию.

## `mountPointId`

Тип: `String`, по умолчанию: `rsg-root`

`id` DOM-элемента, в который монтируется Styleguidist.

## `pagePerSection`

Тип: `Boolean`, по умолчанию: `false`

Рендерит одну section или один component на страницу.

Если `true`, каждая section отображается отдельной страницей.

Значение может зависеть от окружения:

```javascript
module.exports = {
  pagePerSection: process.env.NODE_ENV !== 'production'
}
```

Чтобы children section рендерились как отдельные страницы (subroutes), задайте для section параметр `sectionDepth` — глубину subroutes.

Чтобы компоненты внутри section открывались отдельными route из sidebar, используйте `componentPagePerSection: true` у этой section. Опция включается явно и не меняет текущее поведение, пока вы ее не активируете.

Например:

```javascript
module.exports = {
  pagePerSection: true,
  sections: [
    {
      name: 'Documentation',
      sections: [
        {
          name: 'Files',
          sections: [
            {
              name: 'First File'
            },
            {
              name: 'Second File'
            }
          ]
        }
      ],
      // Покажет "Documentation" и "Files" как отдельные страницы, фильтруя children
      sectionDepth: 2
    },
    {
      name: 'Components',
      sections: [
        {
          name: 'Buttons',
          sections: [
            {
              name: 'WrapperButton'
            }
          ]
        }
      ]
      // Покажет "Components" как отдельную страницу, фильтруя children
      sectionDepth: 1,
    },
    {
      name: 'Examples',
      sections: [
        {
          name: 'Case 1',
          sections: [
            {
              name: 'Buttons'
            }
          ]
        }
      ]
      // Subroutes нет, "Examples" покажет всех children на одной странице
      sectionDepth: 0,
    }
  ]
}
```

С `componentPagePerSection` компоненты внутри такой section открываются по собственному route, а не через `?id=`:

```javascript
module.exports = {
  pagePerSection: true,
  sections: [
    {
      name: 'Components',
      sectionDepth: 0,
      componentPagePerSection: true,
      components: 'src/components/**/*.vue'
    }
  ]
}
```

## `printBuildInstructions`

Тип: `Function`, опционально

Функция для переопределения сообщений о build в `console.log`.

```javascript
module.exports = {
  printBuildInstructions(config) {
    console.log(
      `Style guide published to ${config.styleguideDir}. Something else interesting.`
    )
  }
}
```

## `printServerInstructions`

Тип: `Function`, опционально

Функция для переопределения сообщений локального dev server в `console.log`.

```javascript
module.exports = {
  serverHost: 'your-domain',
  printServerInstructions(config, { isHttps }) {
    console.log(`Local style guide: http://${config.serverHost}`)
  }
}
```

## `previewDelay`

Тип: `Number`, по умолчанию: `500`

Задержка (debounce) в миллисекундах перед рендером изменений из editor. Пока вы печатаете код, preview не обновляется.

## `playgroundEngine`

Тип: `'legacy' | 'vueRepl'`, по умолчанию: `'legacy'`

Выбор реализации playground:

- `legacy`: текущий playground на базе `vue-inbrowser-compiler`;
- `vueRepl`: playground для Vue 3 на базе `@vue/repl`.

Режим `vueRepl` работает без дополнительных отдельных серверов.
Он использует внутренние endpoint-ы Styleguidist для runtime-файлов Vue и не влияет на legacy-поведение, пока вы явно его не включите.

```js
module.exports = {
  playgroundEngine: 'vueRepl'
}
```

Полная настройка и troubleshooting: [Vue REPL engine](/docs/VueRepl.md).

## `propsParser`

Тип: `Function`, опционально

Функция, которая позволяет переопределить механизм парсинга `props` из исходного файла. По умолчанию используется [vue-docgen-api](https://github.com/vue-styleguidist/vue-docgen-api).

```javascript
module.exports = {
  propsParser(filePath, source) {
    return require('vue-docgen-api').parse(filePath)
  }
}
```

## `progressBar`

Тип: `Boolean`, по умолчанию: `true`

Показывать ли progress bar на базе `webpack.ProgressPlugin` во время build.

> **Примечание:** в CI сборки могут быть медленнее с включенным progress bar. При необходимости сделайте параметр зависимым от переменных окружения CI.

## `require`

Тип: `String[]`, опционально

Модули, которые нужно подключить для style guide. Полезно для сторонних стилей и polyfill.

```javascript
module.exports = {
  require: [
    'babel-polyfill',
    path.join(__dirname, 'styleguide/styles.css')
  ]
}
```

> **Примечание:** для каждого элемента массива будет добавлен отдельный webpack `entry`.

Не забудьте добавить webpack loaders для каждого подключаемого файла. Например, для CSS:

```javascript
module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
}
```

Подробности см. в [Configuring webpack](/docs/Webpack.md).

## `renderRootJsx`

Тип: `String`, опционально

Позволяет изменить root component для preview examples. Получает в параметрах preview component и должен вернуть [component jsx](https://vuejs.org/v2/guide/render-function.html). Удобно, когда нужно по умолчанию обернуть все examples в общий контейнер (например, для UI library).

> Примечание: если вы используете styleguidist с Vue 3, вместо `renderRootJsx` используйте [enhancePreviewApp](#enhancePreviewApp), так как `renderRootJsx` не совместим с Vue 3.

Пример:

```javascript
// config/styleguide.root.js
export default function (previewComponent) {
  return {
    render(createElement) {
      return createElement(previewComponent);
    }
  },
}
```

```javascript
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

## `ribbon`

Тип: `Object`, опционально

Показывает ribbon «Fork Me» в правом верхнем углу. Если указан ключ `ribbon`, поле `url` обязательно, `text` — опционально. Для изменения стилей ribbon см. раздел [theme](#theme).

```javascript
module.exports = {
  ribbon: {
    url: 'http://example.com/',
    text: 'Fork me on GitHub'
  }
}
```

## `sections`

Тип: `Array`, опционально

Позволяет группировать компоненты по section с заголовком и overview-контентом. Section может быть и только контентной, без компонентов (например, вводная текстовая страница). Section поддерживают вложенность.

Примеры конфигурации см. в [sections](/docs/Components.md#sections).

## `serverHost`

Тип: `String`, по умолчанию: `0.0.0.0`

Имя dev server.

## `serverPort`

Тип: `Number`, по умолчанию: `6060`

Порт dev server.

## `showSidebar`

Тип: `Boolean`, по умолчанию: `true`

Переключает видимость sidebar. В режиме изоляции examples/components sidebar скрывается даже если здесь стоит `true`. Если `false`, sidebar всегда скрыт.

## `simpleEditor`

Тип: `Boolean`, по умолчанию: `false`

Позволяет не загружать CodeMirror и существенно уменьшить размер bundle, используя [prism.js](https://prismjs.com/) для подсветки. Важно: `editorConfig` в этом режиме не применяется.

## `skipComponentsWithoutExample`

Тип: `Boolean`, по умолчанию: `false`

Игнорирует компоненты без файла examples (определяется через [getExampleFilename](#getexamplefilename)). Такие компоненты не будут доступны из других examples, если вы не [подключите их вручную через `require`](/docs/Cookbook.md#how-to-hide-some-components-in-style-guide-but-make-them-available-in-examples).

## `styleguideComponents`

Тип: `Object`, опционально

Позволяет переопределить React components, используемые для рендера style guide.

```javascript
module.exports = {
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/components/Wrapper'),
    StyleGuideRenderer: path.join(
      __dirname,
      'styleguide/components/StyleGuide'
    )
  }
}
```

Пример см. в [customized style guide](https://github.com/vue-styleguidist/vue-styleguidist/tree/delivery/examples/customised).

Если нужно не заменить, а обернуть компонент, импортируйте default-реализацию по полному пути к `vue-styleguidist`. Пример: [wrapping a Styleguidist component](https://github.com/vue-styleguidist/vue-styleguidist/blob/delivery/examples/customised/styleguide/components/SectionsRenderer.js).

**Примечание:** для этих компонентов не гарантируется полная обратная совместимость между версиями vue-styleguidist.

## `styleguideDir`

Тип: `String`, по умолчанию: `styleguide`

Папка для статического HTML style guide, который создается командой `styleguidist build`.

## `styleguidePublicPath`

Тип: `String`, опционально

Задает префикс URL для build и dev server.

Пример: если указать `/mystyleguide`, dev server будет доступен по адресу `http://localhost:6060/mystyleguide`.

## `styles`

Тип: `Object`, `String` или `Function`, опционально

Позволяет кастомизировать стили любого компонента Styleguidist: через объект, функцию (возвращающую объект) или путь к файлу, экспортирующему этот объект.

Пример см. в [cookbook](/docs/Cookbook.md#how-to-change-styles-of-a-style-guide).

> **Примечание:** функция дает доступ к переменным темы, как в примере ниже. Доступные переменные: [theme variables](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.ts). Возвращаемый объект должен иметь ту же структуру, что и при передаче литерала.

```javascript
module.exports = {
  styles: function (theme) {
    return {
      Logo: {
        logo: {
          // здесь меняем цвет логотипа на цвет `link` из темы
          color: theme.color.link
        }
      }
    }
  }
}
```

**Примечание:** если указан путь к файлу, он должен быть абсолютным или относительным от файла конфигурации.

## `template`

Тип: `Object` или `Function`, опционально

Позволяет изменить HTML-шаблон приложения style guide.

Можно передать объект с опциями (favicon, meta tags, inline JavaScript/CSS и т. п.). Подробности: [документация @vxna/mini-html-webpack-template](https://www.npmjs.com/package/@vxna/mini-html-webpack-template).

```javascript
module.exports = {
  template: {
    favicon: 'https://assets-cdn.github.com/favicon.ico'
  }
}
```

Также можно передать функцию, которая возвращает HTML-строку. См. [mini-html-webpack-plugin docs](https://github.com/styleguidist/mini-html-webpack-plugin#custom-templates).

## `theme`

Тип: `Object` или `String`, опционально

Кастомизирует UI style guide (шрифты, цвета и т. д.) через объект темы или через путь к файлу, который экспортирует такой объект.

Путь может быть абсолютным или относительным от файла конфигурации.

Пример см. в [cookbook](/docs/Cookbook.md#how-to-change-styles-of-a-style-guide).

> **Примечание:** список доступных переменных темы — [theme variables](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.ts).
>
> **Примечание:** стили используют [JSS](https://github.com/cssinjs/jss/blob/master/docs/jss-syntax.md) с plugins: [jss-plugin-isolate](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-isolate), [jss-plugin-nested](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-nested), [jss-plugin-camel-case](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-camel-case), [jss-plugin-default-unit](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-default-unit), [jss-plugin-compose](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-compose), [jss-plugin-global](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-global).
>
> **Примечание:** используйте [React Developer Tools](https://github.com/facebook/react), чтобы находить имена компонентов и классов стилей. Например, компонент `<LogoRenderer><h1 className="rsg--logo-53">` соответствует примеру выше.

> **Примечание:** тема влияет только на компоненты styleguidist (sidebar, заголовки section, таблицы props и т. п.). На ваши демонстрируемые компоненты она не влияет.

## `title`

Тип: `String`, по умолчанию: `<app name from package.json> Style Guide`

Заголовок style guide.

## `sortProps`

Тип: `Function`, опционально

Функция сортировки `props` компонента. По умолчанию сначала идут обязательные `props`, затем опциональные. Внутри каждой группы сортировка по имени.

Чтобы отключить сортировку, используйте identity-функцию:

```javascript
module.exports = {
  sortProps: props => props
}
```

## `tocMode`

Тип: `String`, по умолчанию: `expand`

Определяет поведение section в table of contents (как accordion):

- `collapse`: все section свернуты по умолчанию;
- `expand`: section нельзя свернуть в Table Of Contents.

Сворачивание section в sidebar уменьшает его высоту. Это полезно в больших проектах с большим количеством компонентов.

## `updateDocs`

Тип: `Function`, опционально

Функция, изменяющая `props`, `methods` и метаданные после парсинга source-файла. Например, можно подгружать версию компонента из JSON:

```javascript
module.exports = {
  updateDocs(docs) {
    if (docs.doclets.version) {
      const versionFilePath = path.resolve(
        path.dirname(file),
        docs.doclets.version
      )
      const version = require(versionFilePath).version

      docs.doclets.version = version
      docs.tags.version[0].description = version
    }

    return docs
  }
}
```

## `updateExample`

Тип: `Function`, опционально

Функция, изменяющая code example (Markdown fenced code block). Например, через нее можно загружать examples из файлов:

```javascript
module.exports = {
  updateExample(props, exampleFilePath) {
    const { settings, lang } = props
    if (typeof settings.file === 'string') {
      const filepath = path.resolve(exampleFilePath, settings.file)
      delete settings.file
      return {
        content: fs.readFileSync(filepath),
        settings,
        lang
      }
    }
    return props
  }
}
```

Использование в Markdown:

````md
```js { "file": "./some/file.js" }
```
````

Также можно динамически менять fenced code blocks, которые не должны интерпретироваться как Vue components, используя [модификатор static](/docs/Documenting.md#usage-examples-and-readme-files).

```javascript
module.exports = {
  updateExample(props) {
    const { settings, lang } = props
    if (lang === 'javascript' || lang === 'js' || lang === 'jsx') {
      settings.static = true
    }
    return props
  }
}
```

## `usageMode`

Тип: `'collapse' | 'hide' | 'expand'`, по умолчанию: `collapse`

Определяет начальное состояние вкладки с `props` и `methods`:

- `collapse`: вкладка свернута по умолчанию;
- `hide`: вкладка скрыта и не переключается в UI;
- `expand`: вкладка развернута по умолчанию.

## `validExtends`

Тип: `Function`, по умолчанию: `fileFullPath => !/[\\/]node_modules[\\/]/.test(fileFullPath)`

Функция, напрямую передаваемая в `vue-docgen-api`, чтобы определить, нужно ли парсить компонент, который расширяет другой.

Пример ниже разрешает парсинг extended components из пакета `@my-library/components`:

```javascript
module.exports = {
  validExtends(fullFilePath) {
    return (
      /[\\/]@my-library[\\/]components[\\/]/.test(fullFilePath) ||
      !/[\\/]node_modules[\\/]/.test(fullFilePath)
    )
  }
}
```

**Примечание:** если `vue-docgen-api` не сможет распарсить целевой компонент, будет warning в логах. Это не блокирует сборку, но может мешать.

**Примечание:** если разрешить парсинг всего `node_modules`, это может ухудшить производительность. Используйте аккуратно.

## `verbose`

Тип: `Boolean`, по умолчанию: `false`

Включает подробные отладочные сообщения. Аналог флага командной строки `--verbose`.

## `version`

Тип: `String`, опционально

Версия style guide, показывается под заголовком в sidebar.

## `webpackConfig`

Тип: `Object` или `Function`, опционально

Кастомные опции webpack-конфига, необходимые вашему проекту: loaders, extensions, plugins и т. д.

Можно передать объект:

```javascript
module.exports = {
  webpackConfig: {
    module: {
      resolve: {
        extensions: ['.es6']
      },
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader',
            'sass-loader?precision=10'
          ]
        }
      ]
    }
  }
}
```

Или функцию:

```javascript
module.exports = {
  webpackConfig(env) {
    if (env === 'development') {
      return {
        // custom options
      }
    }
    return {}
  }
}
```

> **Предупреждение:** эта опция отключает загрузку конфига из `webpack.config.js`. Подключайте ваш конфиг [вручную](/docs/Webpack.md#reusing-your-projects-webpack-config).
>
> **Примечание:** опции `entry`, `externals`, `output`, `watch` и `stats` будут проигнорированы. Для production build также игнорируется `devtool`.
>
> **Примечание:** plugins `CommonsChunkPlugins`, `HtmlWebpackPlugin`, `UglifyJsPlugin`, `HotModuleReplacementPlugin` будут проигнорированы, потому что Styleguidist уже добавляет их сам, либо они могут сломать работу Styleguidist.
>
> **Примечание:** чтобы увидеть фактический webpack-конфиг, с которым запускается vue-styleguidist, запустите style guide в verbose-режиме: `npx vue-styleguidist server --verbose`.

Примеры см. в [Configuring webpack](/docs/Webpack.md).
