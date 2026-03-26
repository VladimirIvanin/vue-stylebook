# Документирование компонентов

Vue Styleguidist генерирует документацию компонентов на основе комментариев в исходном коде и файлов Readme.

> **Примечание**: [Посмотрите примеры](/Examples.md) задокументированных компонентов в демо Styleguidist.

<!-- содержание -->

- [Комментарии к коду](#комментарии к коду)
- [Доступные теги](#доступные-теги)
- [События](#события)
- [Слоты](#слоты)
- [Миксины и extends](#миксины-и-extends)
- [Примеры использования и файлы Readme](#примеры-использования-и-файлы-readme)
- [Документация в MDX](#документация-в-mdx)
- [Публичные методы](#публичные-методы)
- [Игнорирование пропсов](#игнорирование-пропсов)
- [Методы](#методы)
- [Составные компоненты](#составные-компоненты)
- [Компоненты TypeScript, Flow и Class-style](#компоненты-typescript-flow-и-class-style)
- [JSX](#jsx)
- [Синтаксис setup](#синтаксис-setup)
- [Написание примеров кода](#написание-примеров-кода)
- [Импорт примеров](#импорт-примеров)

<!-- toc -->

- [Комментарии к коду](#%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B8-%D0%BA-%D0%BA%D0%BE%D0%B4%D1%83)
- [Доступные теги](#%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%D0%BD%D1%8B%D0%B5-%D1%82%D0%B5%D0%B3%D0%B8)
- [События](#%D1%81%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D1%8F)
- [Слоты](#%D1%81%D0%BB%D0%BE%D1%82%D1%8B)
- [Включить миксины и расширения](#%D0%B2%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C-%D0%BC%D0%B8%D0%BA%D1%81%D0%B8%D0%BD%D1%8B-%D0%B8-%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D1%8F)
- [Примеры использования и файлы Readme](#%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%B0%D0%B9%D0%BB%D1%8B-readme)
- [Документация в MDX](#%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%86%D0%B8%D1%8F-%D0%B2-mdx)
- [Публичные методы](#%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B5-%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D1%8B)
- [Игнорирование пропсов](#%D0%B8%D0%B3%D0%BD%D0%BE%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%BE%D0%BF%D1%81%D0%BE%D0%B2)
- [Методы](#%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D1%8B)
- [Сборные компоненты](#%D1%81%D0%B1%D0%BE%D1%80%D0%BD%D1%8B%D0%B5-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D1%8B)
- [TypeScript, компоненты потока и класса](#typescript-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D1%82%D0%BE%D0%BA%D0%B0-%D0%B8-%D0%BA%D0%BB%D0%B0%D1%81%D1%81%D0%B0)
- [JSX](#jsx)
- [Синтаксис настройки](#%D1%81%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%81-%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B8)
- [Написание примеров кода](#%D0%BD%D0%B0%D0%BF%D0%B8%D1%81%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D0%BE%D0%B2-%D0%BA%D0%BE%D0%B4%D0%B0)

<!-- tocstop -->

## Комментарии к коду

Vue Styleguidist отобразит стандартные блоки комментариев JSDoc ваших компонентов.

> **Примечание.** Компоненты и комментарии к документации по умолчанию анализируются библиотекой [vue-docgen-api](Docgen.md). Вы можете изменить это поведение, используя параметры [propsParser](/Configuration.md#propsparser).

```html
<template>
  <div class="Button">/* ... */</div>
</template>

<script>
  /**
   * The only true button.
   * @displayName Best Button
   */
  export default {
    name: 'Button',
    props: {
      /**
       * The color for the button.
       */
      color: {
        type: String,
        default: '#333'
      },
      /**
       * The size of the button
       * @values small, normal, large
       */
      size: {
        type: String,
        default: 'normal'
      },
      /**
       * Gets called when the user clicks on the button
       */
      onClick: {
        type: Function,
        default: event => {
          console.log('You have clicked me!', event.target)
        }
      }
    }
    /* ... */
  }
</script>
```

Обратите внимание на использование тега @displayName для изменения отображаемого имени вашего компонента. Этот блок комментариев верхнего уровня должен располагаться _перед_ `export default` в теге скрипта.

Если вы хотите задокументировать пользовательскую [v-model](https://vuejs.org/v2/guide/comComponents.html#Customizing-Component-v-model), вам необходимо добавить тег `model` в комментарий.

```html
<script>
  export default {
    name: 'my-checkbox',
    props: {
      /**
       * @model
       */
      value: String
    }
  }
</script>
```

## Доступные теги

Вы можете использовать следующие теги при документировании компонентов, пропсов и методов.

### @values

Распространенным шаблоном в компонентах Vue.js является наличие ограниченного набора допустимых значений пропса.

Например, `size` будет принимать только `small`, `medium` и `large`.

Чтобы задокументировать это в Styleguidist, используйте тег `@values`:

```js
export default = {
    props: {
      /**
       * The size of the button
       * @values small, normal, large
       */
      size: {
        type: String,
        default: 'normal'
      }
    }
}
```

См. также:

- [Живой пример](https://vue-styleguidist.github.io/basic/#button)

### @example

Приведите пример того, как использовать документированный элемент. Текст, следующий за этим тегом, будет отображаться как выделенный код.

См. также:

- Это тег JSDoc: [@example](http://jsdoc.app/tags-example.html).

### @deprecated

Тег `@deprecated` помечает сущность в коде как устаревшую:

```js
/**
 * An example-less button.
 * @deprecated Use the [only true button component](#button) instead
 */
```

См. также:

- [Живой пример](https://vue-styleguidist.github.io/basic/#randombutton)
- Это тег JSDoc: [@deprecated](http://jsdoc.app/tags-deprecated.html).

### @see, @link

- Это тег JSDoc: [@see, @link](http://jsdoc.app/tags-see.html).

### @author

- Это тег JSDoc: [@author](http://jsdoc.app/tags-author.html).

### @since

- Это тег JSDoc: [@since](http://jsdoc.app/tags-since.html).

### @version

- Это тег JSDoc: [@version](http://jsdoc.app/tags-version.html).

### @ignore

По умолчанию все свойства ваших компонентов считаются общедоступными и публикуются. В некоторых случаях вы можете удалить свойство из документации, сохранив его в коде. Тег `@ignore` позволяет это сделать. Подробнее см. здесь:

- [Игнорирование пропсов](#игнорирование-пропсов)
- Это тег JSDoc: [@ignore](http://jsdoc.app/tags-ignore.html).

## События

Для документации о событиях добавьте комментарий прямо над ним. Если ваш комментарий находится в начале функции, событие не будет обнаружено.

### В блоке скриптов

Если имя события указано явно, ничего дополнительно указывать не нужно.

```js
/**
 * Success event.
 */
this.$emit('success')
```

Константы также распознаются.

```js
/**
 * Success event.
 */
const success = 'succ'
this.$emit(success)
```

Если имя вашего события происходит от объекта, укажите тег `@event`.

```js
/**
 * Success event.
 *
 * @event success
 */
this.$emit(EVENTS.success)
```

Если событие передает аргументы, используйте тег `@property` для их описания.

> Используйте `@arg` или `@param`, если хотите.

```js
/**
 * Triggers when the number changes
 *
 * @property {number} newValue new value set
 * @property {number} oldValue value that was set before the change
 */
this.$emit('change', newValue, oldValue)
```

### В шаблоне

События, созданные непосредственно в выражениях `v-on`, будут обнаружены автоматически. Чтобы документировать их дальше, в заголовке шаблона приводится над строкой, где появляется `$emit()`.

Блок комментариев, включенная документация, должен сохранять один текст с `@event click`. Остальная часть блока комментариев будет вести себя так же, как блоки комментариев, описанные в скрипте.

`@property` для описания аргументов и вообще без тега для описания событий.

```html
<div>
  <!--
    triggered on click
    @event click
    @property {object} demo - example
    @property {number} called - test called
  -->
  <button @click="$emit('click', test)"></button>
</div>
```

## Слоты

Статические слоты автоматически документируются с помощью styleguidist.

### В шаблоне

Чтобы добавить описание, добавьте комментарий прямо перед этим.

```html
<template>
  <div class="modal">
    <div class="modal-container">
      <div class="modal-head">
        <!-- @slot Use this slot header -->
        <slot name="head"></slot>
      </div>
      <div class="modal-body">
        <!-- @slot Use this slot body -->
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>
```

Помимо документирования слотов и их описания, вы можете документировать привязки. Они документируются как propы или параметры с использованием ключевого слова `@binding`,

Тогда формат будет

```html
<!--
  @binding {type} BindingName description of what the bindings is meant for
  -->
```

пример реального задокументированного слота

```html
<div slot-scope="row" class="list-item1">
  {{row.item.text}}
  <!--
  	@slot Menu Item footer
		@binding {object} icon icon of the menu item
		@binding {string} text text of the menu item
	-->
  <slot name="test" :icon="row.item.icon" :text="row.item.text" />
</div>
```

Чтобы углубиться, ознакомьтесь с компонентом `ScopedSlot` в базовом исходном коде. Прочтите [код](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/examples/basic/src/comComponents/ScopedSlot/ScopedSlot.vue) и прочтите, как он отображается в [живом примере](https://vue-styleguidist.github.io/basic/#scopedslot).

> **Примечание.** Документационный блок должен быть частью **того же** блока комментариев. Несколько отдельных комментариев не анализируются вместе.

> **Примечание 2.** Начиная с версии 4.44.0 вы можете использовать блоки комментариев JS, если захотите. Синтаксис такой же, как в HTML. Одно ограничение: комментарий должен быть единственным содержимым интерполяции:
>
> - Действительный комментарий: `{{/* @slot Menu Item footer */}}`
> - Неверный комментарий: `{{ /* @slot Menu Item footer */ testVariable + 3 }}`.

### В функции рендеринга

Если ваш компонент визуализируется с использованием jsx, tsx или функции рендеринга, styleguidist все равно будет отображать ваши слоты.

Вот два примера, которые были обнаружены и задокументированы:

Определить слот по умолчанию

```js
export default {
  render(createElement) {
    return createElement('div', [
      /**
       * @slot The header
       * @binding {object} menuItem the menu item
       */
      this.$scopedSlots.default({
        menuItem: this.message
      })
    ])
  }
}
```

В функциональном компоненте:

```js
export default {
  functional: true,
  render: function (createElement, { data, children: cld }) {
    /* @slot describe destructured default */
    return createElement('div', data, cld)
  }
}
```

Если Vue Styleguidist не обнаруживает ваши слоты, вы можете явно сообщить об этом с помощью блока комментариев перед рендер-функцией:

```js
export default {
  /**
   * Place the content of your menuitem here,
   * the value of index and content will be passed down to you
   * @slot menuContent
   * @binding {number} index the index in the list
   * @binding {string} content text of the item
   */
  render: function () {
    // ...
  }
}
```

Если у вас несколько слотов, размещайте несколько блоков один за другим:

```js
export default {
  /**
   * @slot content
   */
  /**
   * @slot icon
   */
  render: function () {
    // ...
  }
}
```

## Включить миксины и расширения

Если вы импортируете [mixin](https://vuejs.org/v2/guide/mixins.html) или [extends](https://vuejs.org/v2/api/#extends), он будет автоматически добавлен в ваш основной компонент.

## Примеры использования и файлы Readme

Vue Styleguidist будет искать любые файлы `Readme.md` или `ComponentName.md` в компоненте компонента и отображать их. Любой блок кода с языковым тегом `vue`, `js`, `jsx`, `javascript` или `html` будет PHP как компонент Vue с интерактивной игровой площадкой.

Благодаря поддержке MDX, Vue Styleguidist по умолчанию также ищет `Readme.mdx` и `ComponentName.mdx`.

Если вам нужен файл readme для одного компонента, используйте документ `@example [none]`. Используйте это, когда несколько компонентов в одном экземпляре совместно используют файл `ReadMe`. Это собственное многократное применение.

Пример компонента Vue:

    ```jsx
        <Button size="large">Push Me</Button>
    ```

    Еще один с общим забором кода:

    ```
    <Button size="large">Push Me</Button>
    ```

Вы можете включить редактор, передав модификатор `noeditor`:

    ```jsx noeditor
    <Button>Push Me</Button>
    ```

Чтобы отобразить пример выделенного исходного кода, модификатора страниц `static`:

    ```jsx static
    <Button>Push Me</Button>
    ```

Вы также можете реализовать идею vue для создания более сложных примеров двух методов:

1. Создать новый экземпляр Vue

    ```js
    const names = require('dog-names').all;

    new Vue({
      data(){
        return {
          list: names
        }
      },
      template: `
        <div>
          <RandomButton :variants="list" />
        </div>
      `
    })
    ```

2. Однофайловые компоненты с языковым тегом vue (поддерживает <style sced>)

    ```vue
      <template>
        <div class="wrapper">
          <Button id="dog-name-button" @click.native="pushButton">Push Me</Button>
          <hr />
          <p class="text-name">Next Dog Name: {{ dogName }}</p>
        </div>
      </template>

      <script>
        const dogNames = require('dog-names').all;

        // You can also use 'exports.default = {}' style module exports.
        export default {
          data() {
            return { numClicks: 0, dogName: dogNames[0] };
          },
          methods: {
            pushButton() {
              this.numClicks += 1;
              this.dogName = dogNames[this.numClicks];
            }
          }
        }
      </script>

      <style scoped>
        .wrapper {
          background: blue;
        }
        .text-name {
          color: red;
        }
      </style>
    ```

    Примеры на всех других языках отображаются только как выделенный исходный код, а не как реальный компонент:

    ```html
    <Button size="large">Push Me</Button>
    ```

Любой [Markdown](http://daringfireball.net/projects/markdown/) **разрешён** _здесь_.

> **Примечание.** Вы можете настроить пример имени файла с помощью параметра [getExampleFilename](/Configuration.md#getexamplefilename).

## Документация в MDX

Vue Styleguidist поддерживает `.mdx` для разделения контента и примеров компонентов.

- Используйте MDX, когда нужен Markdown + JSX/ESM в одном документе. Блоки Storybook (`Meta`, `Canvas`, `Story`, `Source`) применяются через классы совместимости. Существующие Markdown-файлы продолжают работать без изменений.

Полный гайд: [MDX](/docs/MDX.md).

Вы также можете добавить [пользовательский блок](https://vue-loader.vuejs.org/en/configurations/custom-blocks.html) `<docs></docs>` внутренние файлы `*.vue`, чтобы Vue Styleguidist создал файл readme. Вы можете просмотреть следующий [пример] (https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/examples/basic/src/comComponents/Radio/Radio.vue#L20)

### Внешние примеры с использованием тегов doclet

Дополнительные файлы можно использовать с компонентами с помощью синтаксиса doclet `@example`.

Следующий компонент также будет иметь пример, загруженный из файла `extra.examples.md`:

```js
/**
 * Component is described here.
 *
 * @example ./extra.examples.md
 */
export default {
  name: 'Button'
  // ...
}
```

> **Примечание.** Вам также понадобится обычный файл (например, `Readme.md`), если [skipComponentsWithoutExample](/Configuration.md#skipcomComponentswithoutexample) имеет значение `true`.

### Игнорировать файлы примеров

Доклетку `@examples` также можно использовать для игнорирования подключенного файла `ReadMe`. Используйте его, чтобы избежать повторного рендеринга примеров.

```js
/**
 * Component is described here.
 *
 * @example [none]
 */
export default {
  name: 'Button'
  // ...
}
```

## Публичные методы

По умолчанию любые методы ваших компонентов, включая частные, не публикуются. Порекомендуйте свои общедоступные методы тегом JSDoc [__IC_0__](http://jsdoc.app/tags-public.html), чтобы опубликовать их в документации:

```javascript
/**
 * Insert text at cursor position.
 *
 * @param {string} text
 * @public
 */
insertAtCursor(text) {
  // ...
}
```

## Игнорирование пропсов

По умолчанию все свойства ваших компонентов считаются общедоступными и публикуются. В некоторых случаях вы можете удалить свойство из документации, сохранив его в коде. Для этого из примера объектного тега JSDoc [__IC_0__](http://jsdoc.app/tags-ignore.html) удалите его из документации:

```javascript
  props: {
    /**
    * @ignore
    */
    color: {
      type: String,
      default: '#333'
    }
```

### отображаемое имя

В дополнении к этим тегам вы можете использовать `@displayName`, чтобы изменить имя, отображаемое в вашем руководстве по стилю. Знайте, что, поскольку его визуальное имя изменилось, его имя теперь состоит из букв без пробелов и знаков препинания.

Например, если отображаемое имя установлено как

```js
/**
 * @displayName Wonderful Button
 **/
```

Чтобы ссылаться на него в примерах, нужно вызвать `<WonderfulButton/>`. См. [Как использовать имя компонента в документах с другим отображаемым именем](./Cookbook.md#how-to-use-comComponent-name-in-docs-with-a- Different-displayname)

## Методы

При документировании методов вы также можете использовать:

- [@param, @arg, @argument](http://jsdoc.app/tags-param.html)

Документирование событий:

- [@event](http://jsdoc.app/tags-event.html)

Документирование v-модели:

- @модель

Теги могут даже отображать Markdown.

- [@public](http://jsdoc.app/tags-public.html)

Вы можете пометить свои общедоступные методы тегом JSDoc `@public`, чтобы опубликовать их в документации.

```html
<template>
  <!-- -->
</template>

<script>
  /**
   * The only true button.
   * @version 1.0.1
   */
  export default {
    name: 'Button',
    props: {
      /**
       * The color for the button.
       * @see See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names)
       * @see See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) for a list of color names
       */
      color: {
        type: String,
        default: '#333'
      },
      /**
       * The size of the button
       * `small, normal, large`
       * @since Version 1.0.1
       */
      size: {
        type: String,
        default: 'normal'
      },
      /**
       * Gets called when the user clicks on the button
       */
      onClick: {
        type: Function,
        default: event => {
          console.log('You have clicked me!', event.target)
        }
      }
    },
    methods: {
      /**
       * Gets called when the user clicks on the button
       *
       * @param {SyntheticEvent} event The react `SyntheticEvent`
       * @param {Number} num Numbers of examples
       * @public This is a public method
       */
      launch(event, num) {
        /* ... */
      },
      // ...
      ignoreMethod() {
        /**
         * Success event.
         *
         * @event success
         * @type {object}
         */
        this.$emit('success', {})
      }
    }
    /* ... */
  }
</script>
```

## Сборные компоненты

Если компонент представляет собой список или таблицу, его проще написать с помощью API композиции.

Например, выпадающий элемент будет легче читать таким образом.

```html
<DropDown>
  <Choice val="1">value 1</Choice>
  <Choice val="2">value 2</Choice>
</DropDown>
```

чем с propом

```html
<DropDown
  :choices="[{val:1,text:'value 1'}, {val:2,text:'value 2'}]"
/>
```

Вот как Vue Styleguidist помогает создать этот шаблон: В каждом документе, источник дополнительного компонента, будет автоматически зарегистрирован так же, как и основной компонент.

### Пример

В предыдущем примере у нас есть компонент `DropDown`, для логической визуализации которого требуется компонент `Choice`. Вот как должен выглядеть компонент `DropDown.vue`.

```vue
<template>
  <select>
    <slot />
  </select>
</template>

<script>
/**
 * @requires ./Choice.vue
 */
export default {
  name: 'DropDown'
}
</script>
```

> **ПРИМЕЧАНИЕ.** Теперь `Choice` будет документироваться **только** как часть `DropDown`. У него не будет ни своей страницы, ни приведенных примеров. Его propы будут использоваться с помощью `DropDown`s и будут доступны в примерах `DropDown`s.

## TypeScript, компоненты потока и класса

Vue Styleguidist понимает аннотации TypeScript и Flow. Пишите компоненты на типизированном языке, типы автоматически документируются. Он также совместим с компонентами стиля, с TypeScript или без него.

```ts
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ClassButton'
})
export default class MyComponent extends Vue {
  aHiddenData: string = ''

  /**
   * prop typed through the decorators arguments
   */
  @Prop({ type: String })
  propNoType = ''

  /**
   * prop typed through an annotation
   */
  @Prop() propA: number = 0

  /**
   * prop with a default value
   */
  @Prop({ default: 'default value' })
  propB: string = 'hello'

  /**
   * prop with a hybrid type
   */
  @Prop() propC: string | boolean = false

  /**
   * method testing
   * @public
   */
  onClick(a: string) {
    /**
     * Success event when we click
     */
    this.$emit('success', a)
  }
}
```

Обратите внимание, что параметр `onClick` `a` не требует документации типа.

## JSX

Vue Styleguidist также понимает шаблоны компонентов JSX. В этом примере будет преобразовано определение найденного слота.

```jsx
export default {
  render() {
    return (
      <div>
        {/** @slot Use this slot to have a header */}
        <slot name="header" />
        {this.contentText}
      </div>
    )
  }
}
```

## Синтаксис настройки

В Vue 3 появился [синтаксис setup](https://v3.vuejs.org/api/sfc-script-setup.html). Он заметно повышает читаемость компонентов и улучшает типизацию в TypeScript.

Начиная с версии 4.44.0, Vue Styleguidist позволяет документировать propы и события, настроенные с помощью этого синтаксиса.

Начиная с версии 4.56.2, Vue Styleguidist позволяет использовать открытые переменные из ваших компонентов.

### Реквизит

В статье JavaScript-комментарий к свойству объекта, переданному в `defineProps()`. В этих комментариях использовался тот же принцип, что и в обычном синтаксисе Props.

```js
defineProps({
  /**
   * Should the prop be required?
   * @link https://v3.vuejs.org/
   */
  testProp: {
    type: Boolean,
    required: true
  }
})
```

То же самое касается большинства компонентов TypeScript:

```ts
defineProps<{
  /**
   * A very nice prop, now accepting numbers
   */
  testProp: number
  /**
   * An old prop
   * @deprecated prefer using the other prop
   */
  anotherTestProps?: boolean
}>()
```

### События

Все события развиваются с помощью функции `defineEmits()`. Документируйте их в комментариях перед записями о мероприятиях.

```js
const emit = defineEmits({
  /**
   * Document your event here
   * @arg {string} payload - The first argument
   */
  submit: payload => {
    if (payload.email && payload.password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})
```

и в TypeScript

```ts
interface Format {
  email: string
  password: string
}

const emit = defineEmits<{
  /**
   * Cancels everything
   */
  (event: 'cancel'): void
  /**
   * Save the world
   * @arg {{ email: string, password: string }} payload - The payload
   */
  (event: 'save', payload: Format): void
}>()
```

> **ПРИМЕЧАНИЕ.** Не забудьте привести сложные аргументы в комментариях к событию. Документ не анализирует типы и отображает только их имена.

### Открытые свойства

все свойства реализуются с помощью функции `defineExpose()`. Документируйте их в комментариях перед записями свойств.

```js
const emit = defineExpose({
  /**
   * Document your property here
   * @returns  {string} version - your component version
   */
  getVersion() {
    return 'XX.XX.XX'
  }
})
```

## Написание примеров кода

Примеры кода в Markdown используют синтаксис ES6. Они могут получить доступ ко всем компонентам вашего управления по стилю, используя глобальные переменные:

```jsx
<Panel>
  <p>
    Using the Button component in the example of the Panel component:
  </p>
  <Button>Push Me</Button>
</Panel>
```

> **Примечание.** Vue Styleguidist использует [Bublé](https://buble.surge.sh/guide/) для запуска кода ES6 во внешнем интерфейсе. Он поддерживает [большинство функций ES6](https://buble.surge.sh/guide/#unsupported-features).

Вы также можете `import` другие модули (например, макеты данных, которые вы используете в своих модульных тестах) из примеров в Markdown:

```jsx
const mockData = require('./mocks');
<Message :content="mockData.hello" />
```

> **Примечание.** Если вам нужна более сложная демонстрация, определите ее в отдельном файле JavaScript и `import` в Markdown. Если файл компонента находится рядом с Markdown-документацией, используйте `import { myExample as exam } from './myExample';`. Затем этот импорт можно использовать в примерах. Обратите внимание, что код инициализации не будет включен в документацию. >
```jsx
> import { myExample as Button } from './myExample'
> ;<div>
>   <Button />
> </div>
> ```

> **Примечание** Если вы предпочитаете использовать JSX в своих примерах, воспользуйтесь параметром [jsxInExample](/Configuration.md#jsxInExamples) в вашем `styleguide.config.js`. Использование этой опции заставит вас использовать подходящий формат Vue для ваших примеров. Больше никакого псевдо-JSX-кода. >
Это не будет работать с параметром [jsxInExample](Configuration.md#jsxInExamples).
>
```jsx
> <Button />
> ```
>
... хотя это было бы справедливо
>
```jsx
> export default {
>   render() {
>     return <Button />
>   }
> }
> ```

## Импорт примеров

Чтобы сделать автозаполнение и подсветку синтаксиса практичными, можно также импортировать примеры из внешних файлов. В следующем примере `./myExample.vue` будет использоваться в аналогичном примере.

````markdown
```[import](./myExample.vue)
Набранный здесь текст будет полностью проигнорирован. Вы можете использовать его для описания примера, импортированного для целей обслуживания.
```
````

> **Примечание** Эта опция НЕ заменяет автоматически примеры кода в `vue-docgen-cli`. Поскольку механизм рендеринга просто копирует содержимое Markdown, CLI не может определить, какие примеры нужно заменять.

> **Примечание** Не нужно указывать язык, поскольку он будет указан из названия файла.

> **Примечание** Все флаги, описанные [here](#usage-examples-and-readme-files), по-прежнему можно использовать.