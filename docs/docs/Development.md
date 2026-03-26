# Руководство разработчика

> Vue Styleguidist, созданный на основе [React Styleguidist](https://github.com/styleguidist/react-styleguidist), обеспечивает дополнительную поддержку для чтения и компиляции файлов .vue.

<!-- содержание -->

- [How it works](#how-it-works)
- [Webpack loaders and Webpack configuration](#webpack-loaders-and-webpack-configuration)
- [React components](#react-components)
- [Styles](#styles)
- [Render vue components](#render-vue-components)

<!-- toc -->

- [Как это работает](#%D0%BA%D0%B0%D0%BA-%D1%8D%D1%82%D0%BE-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%D0%B5%D1%82)
- [Загрузчики Webpack и изменения Webpack](#%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%B8-webpack-%D0%B8-%D0%B8%D0%B7%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D1%8F-webpack)
- [Компоненты реагирования](#%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D1%8B-%D1%80%D0%B5%D0%B0%D0%B3%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F)
- [Стили](#%D1%81%D1%82%D0%B8%D0%BB%D0%B8)
- [Рендеринг компонентов Vue](#%D1%80%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D0%B8%D0%BD%D0%B3-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2-vue)

<!-- tocstop -->

Styleguided — это не обычное одностраничное приложение, и некоторые дизайнерские решения могут показаться постороннему человеку запутанными. В этом руководстве мы объяснили эти решения, чтобы не запутать представителей.

Главное приложение мы запускаем два раза одновременно: пользовательские компоненты и пользовательский интерфейс Styleguidist. Мы используем Webpack конфигурации и стили в одной области действия (в CSS только одну область действия). И мы можем управлять только одним из этих двух приложений: пользовательским интерфейсом Styleguidist. Это накладывает на нас некоторые ограничения:

- Наши стили не должны влиять на основные компоненты стилей.
- Пользовательские стили (особенно глобальные, такие как Bootstrap) не должны влиять на пользовательский интерфейс Styleguidist.
- Стили `body` (например, `font-family`) должны влиять на пользовательские компоненты так, как ожидает пользователь, но не на пользовательский интерфейс Styleguidist.

## Как это работает

Vue Styleguidist использует [vue-docgen-api](Docgen.md) для анализа файлов _source_ (нетранспилируемых). vue-docgen-api находит экспортированные компоненты Vue и следующую документацию.

Styleguidist использует Markdown для документации: каждый блок кода JavaScript отображается как интерактивная игровая площадка с [CodeMirror](http://codemirror.net/). Для этого мы извлекаем все эти блоки кода, используя [Remark](http://remark.js.org/).

Загрузчики Webpack (см. ниже) генерируют модули JavaScript. В каждом из этих модулей каждый компонент, указанный пользователем, анализируется вместе с его документацией и примерами. Затем весь модуль в приложении React, который отображает руководство по стилю.

## Загрузчики Webpack и изменения Webpack

Мы используем загрузчики Webpack для горячей перезагрузки в соответствии с изменениями стилей компонентов, стилей и документации Markdown. У нас есть три загрузчика (папка [loaders](https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-stylebook-engine/loaders)):

- `styleguide-loader`: загружает компоненты и разделы;
- `vuedoc-loader`: загружает документацию по реквизитам, с помощью [vue-docgen-api](Docgen.md);
- `examples-loader`: загружает файлы из файлов Markdown;

Есть еще два загрузчика — `css-loader` и `styles-loader`. Это однострочные псевдонимы соответствующих загрузчиков Webpack. Мы не надеемся на преобразователь загрузчика Webpack, поскольку его поведение может быть изменено пользовательской конфигурацией Webpack (например, это создаёт приложение React). Таким образом, мы можем обойти преобразователь Webpack и вместо этого использовать преобразователь Node. Эти загрузчики обращались следующим образом:

```js
require('!!../../../loaders/style-loader!../../../loaders/css-loader!codemirror/lib/codemirror.css')
```

Префикс `!!` сообщает, что Webpack не использует другие загрузчики, которые могут быть указаны в конфигурации Webpack, для загрузки этого модуля. Это означает, что изменение пользователя Webpack не влияет на Styleguidist.

Styleguidist загрузите и повторно используйте конфигурацию пользователя Webpack (`webpack.config.js` в корневой папке проекта). В большинстве случаев он работает, но имеет некоторые ограничения: Styleguidist [игнорирует](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/packages/vue-stylebook-engine/scripts/utils/mergeWebpackConfig.js), некоторые поля и плагины, поскольку они уже включены (например, `webpack.HotModuleReplacementPlugin`), не имеют смысла для управления стилями (например, `output`) или могут сломать Styleguidist (например, `entry`).

Мы сохраняем собственную [конфигурацию Webpack] Styleguidist (https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/packages/vue-stylebook-engine/scripts/make-webpack-config.js) минимально, чтобы уменьшить конфликты с конфигурацией пользователя.

## Компоненты реагирования

Большинство компонентов пользовательского интерфейса StyleGuidist состоят из двух частей: `Foo/Foo.js`, который содержит всю логику, и `Foo/FooRenderer.js`, который содержит всю разметку и стили. Это позволяет пользователям настраивать рендеринг, переопределяя компонент `*Renderer` с псевдонимами веб-пакета (или с помощью параметра конфигурации [styleguideComponents](/Configuration.md#styleguidecomponents)):

```js
// styleguide.config.js
const path = require('path')
module.exports = {
  webpackConfig: {
    resolve: {
      alias: {
        'rsg-components/Wrapper': path.join(
          __dirname,
          'lib/styleguide/Wrapper'
        )
      }
    }
  }
}
```

Все компоненты Styleguidist должны быть импортированы следующим образом: `import Foo from 'rsg-components/Foo'`, чтобы псевдонимы работали.

В каждой папке компонента обычно имеется несколько файлов:

- `Foo/Foo.js` (необязательно для буквенных компонентов);
- `Foo/FooRenderer.js`;
- `Foo/Foo.spec.js` — тесты;
- `Foo/index.js` — реэкспорт `Foo.js` или `FooRenderer.js`.

## Стили

Для стиля, который мы используем [JSS](http://cssinjs.org/), он позволяет пользователям настраивать руководство по стилю и обеспечивает изоляцию стиля (спасибо [jss-plugin-isolate](http://cssinjs.org/jss-plugin-isolate/)). Никакие пользовательские стили не должны влиять на пользовательский интерфейс Styleguidist, а стили Styleguidist не должны влиять на пользовательские компоненты.

Используйте [classnames](https://github.com/JedWatson/classnames), чтобы создать несколько имен классов или для условных имен классов, импортируйте их как `cx` (`import cx from 'classnames'`).

Мы используем компонент более высокого порядка `Styled`, чтобы разрешить использование темы (см. параметры конфигурации управления по стилю [theme](/Configuration.md#theme) и [style](/Configuration.md#style)). Используйте это следующим образом:

```jsx
import React from 'react'
import Styled from 'rsg-components/Styled'

export const styles = ({ fontFamily, fontSize, color }) => ({
  button: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.base,
    color: color.light,
    '&:hover, &:active': {
      isolate: false,
      color: color.lightest
    }
  }
})

export function ExamplePlaceholderRenderer({ classes }) {
  return (
    <button className={classes.button}>I am a styled button</button>
  )
}
```

Проверьте доступные переменные темы в [src/styles/theme.js](https://github.com/styleguidist/react-styleguidist/blob/master/src/styles/theme.js).

Из-за открытия и темы вам необходимо явно объявить `fontFamily`, `fontSize` и `color`. Добавьте `isolate: false` в стили на выведения, иначе вам пригодятся базовые стили без наведения.

## Рендеринг компонентов Vue

Для рендеринга компонентов Vue Styleguidist использует компоненты React [Preview.js](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/packages/vue-stylebook-engine/src/rsg-comComponents/Preview/Preview.js).

Как только пользователи открывают страницу, монтируется предварительный просмотр.

Примеры функции рендеринга при обновлении codemirror — `executeCode()`.

### Отделить скрипт от шаблона

Сначала мы извлекли из него весь JavaScript, выполнив следующие действия:

- если он содержит `new Vue`, преобразуйте традицию как скрипт
- если это один файловый компонент, извлеките шаблон и скрипт и скомпилируйте скрипт.
- еще прочтите первый текст, который начинается с `<`, тогда все, что перед ней, — js, а остальное — HTML.

### Подготовьте код

Скрипты преобразуются из es6 или jsx в es5 с помощью Buble. Имена целей, объявленных в глобальном масштабе, извлекаются, поскольку их невозможно использовать при затратах. Затем код обрабатывается с понижением `getConfig`.

### Пример рендеринга

Во-первых, убедитесь, что точка монтирования готова, и сохраните ее в переменном состоянии. Во-вторых, подготовьте компонент, выполнив функцию, созданную выше `exampleComponent()`. И, наконец, создайте экземпляр vue для монтирования нашего компонентного компонента в точку монтирования.

### Горячая перезагрузка

Чтобы включить горячую перезагрузку даже при компиляции сайта, нам необходимо оставить основной компонент `Preview` неизменным. Вместо этого мы будем играть со всем, что находится внутри этого дома. При размонтировании, когда компонент `Preview` перезагружается, мы очищаем экземпляр vue, чтобы создать новую ссылку: `unmountPreview()`.