# vue-docgen-api

`vue-docgen-api` преобразует компоненты VueJs в документацию объектов.

<!-- содержание -->

- [API](#api)
- [Architecture](#architecture)
- [Custom Tags](#custom-tags)

<!-- toc -->

- [API](#api)
- [Архитектура](#%D0%B0%D1%80%D1%85%D0%B8%D1%82%D0%B5%D0%BA%D1%82%D1%83%D1%80%D0%B0)
- [Пользовательские теги](#%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B5-%D1%82%D0%B5%D0%B3%D0%B8)

<!-- tocstop -->

## API

### Введите `ComponentDoc`

Каждый анализатор в docgen-api возвращает экземпляр `ComponentDoc` или `ComponentDoc[]`.

```ts
interface ComponentDoc {
  /**
   * Usual name of the component:
   *  It will take by order of priority
   *  - The contents of the @displayName tag of the component
   *  - The name of the variable containing the component (or the class if class component)
   *  - the name of the file containing the component
   */
  displayName: string

  /**
   * name of the export containing the component
   * In most cases `default`
   * If you export es6 named components you can find those names here
   */
  exportName: string

  /**
   * Contents of every line that is not contained in a tag
   * in the code block before your component
   * @see below
   */
  description?: string
  /**
   * Array of `PropDescriptor` objects describing all props unless ignored via the @ignore tag
   */
  props?: PropDescriptor[]
  /**
   * Array of `MethodDescriptor` objects describing all methods declared public via the @public tag
   */
  methods?: MethodDescriptor[]
  /**
   * Array of `SlotDescriptor` objects describing all slots
   */
  slots?: SlotDescriptor[]
  /**
   * Array of `EventDescriptor` objects describing all event emitted by your components
   */
  events?: EventDescriptor[]
  /**
   * All tags applied to the component
   * @remark only component tags are stored here.
   * Prop, method and event tags are stored with the property they describe
   */
  tags?: { [key: string]: BlockTag[] }
  /**
   * When using SFC components, one can use `<docs>` blocks.
   * This is the content of the current docs block if it was found
   */
  docsBlocks?: string[]
  /**
   * Extra free data that user can set if they need (not used in the current standard)
   */
  [key: string]: any
}
```

### `parse(filePath:string, options?: DocGenOptions):ComponentDoc`

Анализирует файл по адресу filePath. Возвращаемые данные и объекты, содержащие все документированные и недокументированные свойства компонента.

```ts
import { parse } from 'vue-docgen-api'

var componentInfoSimple = parse(filePath)
```

В параметрах указаны изменения, которые вы вносите в определения узлов через конфигурацию Webpack. Напишите дополнительные разработчики скриптов и шаблонов и поместите их в параметры параметров для анализа нестандартных элементов.

```ts
import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { parse, Documentation, ParseOptions } from 'vue-docgen-api'
import { ASTElement } from 'vue-template-compiler'

var componentInfoConfigured = parse(filePath, {
  alias: { '@assets': path.resolve(__dirname, 'src/assets') },
  resolve: [path.resolve(__dirname, 'src')],
  addScriptHandlers: [
    function (
      documentation: Documentation,
      componentDefinition: NodePath,
      astPath: bt.File,
      opt: ParseOptions
    ) {
      // handle custom code in script
    }
  ],
  addTemplateHandlers: [
    function (
      documentation: Documentation,
      templateAst: ASTElement,
      options: TemplateParserOptions
    ) {
      // handle custom directives here
    }
  ],
  preScriptHandlers: [
    function (
      documentation: Documentation,
      componentDefinition: NodePath,
      astPath: bt.File,
      opt: ParseOptions
    ) {
      // replaces handlers run before the scriptHandlers
    }
  ],
  scriptHandlers: [
    function (
      documentation: Documentation,
      componentDefinition: NodePath,
      astPath: bt.File,
      opt: ParseOptions
    ) {
      // replaces all the scriptHandlers
    }
  ],
  templateHandlers: [
    function (
      documentation: Documentation,
      templateAst: ASTElement,
      options: TemplateParserOptions
    ) {
      // replaces all the templateHandlers
    }
  ]
})
```

### `parseSource(code: string, filePath:string, options?: DocGenOptions):ComponentDoc`

То же самое и `parse`, но таким образом вы можете изменить критерии качества. Параметр `filePath` будет использоваться только для зависимостей разрешения.

### `parseMulti(code: string, filePath:string, options?: DocGenOptions):ComponentDoc[]`

То же самое, что и `parse`, но позволяет экспортировать несколько компонентов в один файл.

**ПРИМЕЧАНИЕ** Тип возвращаемого значения — `Array<ComponentDoc>` вместо `ComponentDoc`. Используйте `exportName`, чтобы различать экспорт.

### опции `DocGenOptions`

#### `alias`

Это зеркало параметров [псевдоним веб-пакета](https://webpack.js.org/configuration/resolve/#resolvealias). Если вы используете [псевдоним в Webpack](https://webpack.js.org/configuration/resolve/#resolvealias) или путь в TypeScript, вам следует разразить его здесь.

#### `resolve`

`resolve` также отражает [опцию веб-пакета](https://webpack.js.org/configuration/resolve/#resolve). Если он у вас есть в Webpack или вы используете `baseDir` в TypeScript, вам, вероятно, стоит посмотреть, как он работает.

#### `addScriptHandlers` и `addTemplateHandlers`

Дополнительные пользовательские обработчики позволяют добавлять в анализатор собственные обработчики. Обработчик может перемещаться и видеть пользовательские объекты, которые стандартный анализатор проигнорировал бы.

#### `preScriptHandlers`, `scriptHandlers` и `templateHandlers`

Заменяет данные всех обработчиков. Если для каждого из этих трёх `handlers` определено значение [], библиотека будет анализировать только данный компонент. Он больше не будет запускать стандартные рабочие процессы.

> **ПРИМЕЧАНИЕ** Стандартные обработчики доступны в виде пространств имен. Импортируйте и используйте их следующим образом:
>
> ```js
> импортировать {
>   анализировать,
>   Обработчики сценариев,
>   Обработчики шаблонов
> } из «vue-docgen-api»
>
> синтаксический анализ('myComp', {
>   scriptHandlers: [ScriptHandlers.comComponentHandler],
>   templateHandlers: [TemplateHandlers.slotHandler]
> })
> ```

#### `validExtends`

Функция — возвращает значение, если расширенный компонент должен быть проанализирован docgen.

> **ПРИМЕЧАНИЕ** Если документ не позволит обратить внимание на включение компонента, он зарегистрирует предупреждение. Это не блокирует, но раздражает.

> **ПРИМЕЧАНИЕ**. Если вы разрешите анализ всего `node_modules`, это может привести к снижению производительности. Используйте его ответственно.

## Архитектура

### Объект документации

Класс `Documentation` является контейнером информации перед компиляцией. Для использования и экспорта используйте функцию `toObject()`, чтобы создать нейтральный сериализуемый объект.

Объект имеет функции для получения дескрипторов реквизитов, событий, методов и слотов. Все эти функции следуют одному и тому же принципу. Если вы вызовете его дважды с одним и тем же аргументом, он дважды вернет одну и ту же ссылку на свойство. Таким образом, если ваш реквизит оформлен в нескольких местах, это упрощает его документацию.

```ts
function getPropDescriptor(propName: string): PropDescriptor
```

### Парсеры

Сначала мы используем Babel для анализа комментариев в коде.

Затем мы используем `vue-template-compiler` для анализа HTML-шаблона.

Эти парсеры дают нам абстрактные синтаксические деревья (AST). Затем мы обрабатываем их с помощью обработчиков, чтобы включить информацию из компонентов и их JSdoc.

### Обработчики

Скрипт и шаблон имеют две разные структуры AST. Имеет смысл, что у них разные обработчики. В документе есть несколько стандартных обработчиков. Вы можете добавить свои собственные, используя опции `addScriptHandler` или `addTemplateHandler`.

### Обработчики сценариев

Для обработки скриптов мы можем зарегистрировать их таким образом. Каждый обработчик представляет собой функцию JavaScript, соответствующую этому прототипу.

```ts
export default function handler(
  documentation: Documentation,
  componentDefinition: NodePath,
  astPath: bt.File,
  opt: ParseOptions
) {
  // Handling of the documentation on the script
}
```

В следующем материале мы используем функциональный флаг объекта Vue.

```ts
import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation, ParseOptions } from 'vue-docgen-api'

export default function handler(
  documentation: Documentation,
  componentDefinition: NodePath,
  astPath: bt.File,
  opt: ParseOptions
) {
  // deal with functional flag
  if (bt.isObjectExpression(componentDefinition.node)) {
    const functionalPath = componentDefinition
      .get('properties')
      .filter(
        (p: NodePath) =>
          bt.isObjectProperty(p.node) &&
          p.node.key.name === 'functional'
      )

    if (functionalPath.length) {
      const functionalValue = functionalPath[0].get('value').node
      if (bt.isBooleanLiteral(functionalValue)) {
        documentation.set('functional', functionalValue.value)
      }
    }
  }
  // ...
}
```

### Обработчики шаблонов

Обработчики шаблонов имеют следующий прототип.

```ts
export default function handler(
  documentation: Documentation,
  templateAst: ASTElement,
  options: TemplateParserOptions
) {
  // template handler code
}
```

В следующем примере все атрибуты имен кнопок в шаблоне указаны в ключе `buttons`.

```ts
import { ASTElement } from 'vue-template-compiler'
import { Documentation, TemplateParserOptions } from 'vue-docgen-api'

export default function slotHandler(
  documentation: Documentation,
  templateAst: ASTElement,
  options: TemplateParserOptions
) {
  if (templateAst.tag === 'button') {
    let buttons = documentation.get('buttons') || []
    buttons.push(templateAst.attrsMap['name'])
    documentation.set('buttons', buttons)
  }
}
```

## Пользовательские теги

API собирает все пользовательские документы, которые содержатся в коде ваших блоков. Для настройки слота, опоры или корневого компонента (блок комментариев перед `export default`) любые нераспознанные теги доклетки преобразуются в отдельный объект `tags`. Например, представьте, что в вашей документации вы хотите указать читателям текстовое поле с двусторонней привязкой к вашему слоту, чтобы они могли просмотреть рейтинг вашего слота в первом компоненте. Вам потребовались некоторые вымышленные данные, когда пользователь ничего не ввел. Вы можете передать эти вымышленные данные следующим образом:

```html
<template>
  <button>
    <!--
      @slot The text on the button
      @mock Click me
    -->
    <slot />
  </button>
</template>
```

Выходной объект для этого компонента будет выглядеть примерно так:

```js
{
  "displayName": "Button",
  "exportName": "Button",
  "tags": {}, // top-level comment block custom tags would go here
  // ...
  "props": [{
    // ...
    "tags": {}, // prop-level custom tags would go here
    // ...
  }]
  // ...
  "slots": [{
    "name": "default",
    "description": "The text on the button",
    "tags": {
      "mock": [{
        "description": "Click me",
        "title":"mock"
      }]
    }
  }],
  // ...
}
```
