# MDX

Vue Styleguidist поддерживает файлы `.mdx` как для контента секций, так и для примеров компонентов.
Это позволяет хранить рядом обычную markdown-документацию и более гибкие MDX-доки с JSX/ESM.

> Поддержка `MDX` добавочная: существующие `.md` файлы продолжают работать как раньше.

<!-- toc -->

- [Что поддерживается](#что-поддерживается)
- [Как выбираются файлы](#как-выбираются-файлы)
- [Совместимость со Storybook blocks](#совместимость-с-storybook-blocks)
- [Конфигурация](#конфигурация)
- [Использование MDX в секциях](#использование-mdx-в-секциях)
- [Использование MDX как примеров компонентов](#использование-mdx-как-примеров-компонентов)
- [Использование `@example` с MDX](#использование-example-с-mdx)
- [Ограничения и отличия от Storybook](#ограничения-и-отличия-от-storybook)
- [Решение проблем](#решение-проблем)
- [Миграция с Markdown на MDX](#миграция-с-markdown-на-mdx)

<!-- tocstop -->

## Что поддерживается

- Файлы `.mdx` компилируются через `@mdx-js/mdx`.
- Включены расширения GFM (`remark-gfm`), поэтому работают таблицы и fenced-блоки кода.
- Для заголовков и внешних ссылок подключены `rehype-slug` и `rehype-external-links`.
- Внутри MDX можно использовать ESM-импорты и экспорты.
- MDX работает в:
  - `content` секций
  - файлах примеров компонентов, найденных через `getExampleFilename`
  - doclet-ссылках вида `@example ./path/to/file.mdx`

## Как выбираются файлы

По умолчанию Vue Styleguidist ищет файлы примеров в таком порядке:

1. `Readme.mdx`
2. `Readme.md`
3. `ComponentName.mdx`
4. `ComponentName.md`

Если найден файл `.mdx`, используется MDX loader.
Если найден `.md`, используется существующий markdown examples loader.

## Совместимость со Storybook blocks

Чтобы упростить перенос документации из Storybook, в Vue Styleguidist есть слой совместимости для `@storybook/blocks`.

Сейчас поддерживаются блоки:

- `Meta`
- `Canvas`
- `Story`
- `Source`

Импорт такой же, как в Storybook:

```mdx
import { Meta, Canvas, Source } from '@storybook/blocks'
```

`Meta` в рендере Vue Styleguidist работает как метаданные/no-op.
`Canvas` и `Story` рендерят совместимые контейнеры контента.
`Source` рендерит блоки кода.

## Конфигурация

### `mdxCompileOptions`

Тип: `Object`, по умолчанию: `{}`

Дополнительные опции компиляции, передаваемые в MDX-пайплайн.
Можно использовать для добавления своих `remark` / `rehype` плагинов или переопределения `providerImportSource`.

```js
module.exports = {
  mdxCompileOptions: {
    // Примеры:
    // remarkPlugins: [myRemarkPlugin],
    // rehypePlugins: [myRehypePlugin],
    providerImportSource: '@mdx-js/react'
  }
}
```

### `storybookBlocks`

Тип: `Boolean`, по умолчанию: `true`

Включает алиас `@storybook/blocks` на встроенный слой совместимости.
Поставьте `false`, если хотите подложить собственную реализацию через webpack aliases.

```js
module.exports = {
  storybookBlocks: true
}
```

## Использование MDX в секциях

Можно напрямую использовать `.mdx` в `content` секции:

```js
module.exports = {
  sections: [
    {
      name: 'Guides',
      content: 'docs/intro.mdx'
    }
  ]
}
```

## Использование MDX как примеров компонентов

Если в папке компонента есть `Readme.mdx`, он будет подхвачен автоматически дефолтной конфигурацией.

Разрешение можно и кастомизировать:

```js
module.exports = {
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.vue$/, '.examples.mdx')
  }
}
```

## Использование `@example` с MDX

Doclet `@example` может ссылаться на MDX-файлы:

```js
/**
 * Button docs
 * @example ./Button.docs.mdx
 */
export default {
  name: 'Button'
}
```

`@example [none]` по-прежнему работает и отключает связанные примеры.

## Ограничения и отличия от Storybook

- Vue Styleguidist не запускает внутренний runtime Storybook.
- Слой совместимости нацелен на практическую совместимость распространенных doc-паттернов.
- Часть продвинутых Storybook-специфичных сценариев может не совпадать 1:1.

Если вы сильно зависите от специфики Storybook docs runtime, лучше использовать простые совместимые блоки и явно импортируемые компоненты в MDX.

## Решение проблем

### `Cannot find module '@storybook/blocks'`

Оставьте `storybookBlocks: true` (по умолчанию) или задайте собственный alias в webpack-конфиге.

### MDX компилируется, но рендер выглядит некорректно

Проверьте кастомные плагины в `mdxCompileOptions`.
Временно отключите их и возвращайте по одному.

### Файл `.mdx` не подхватывается как пример компонента

Проверьте результат `getExampleFilename` и регистр символов в путях.
Помните, что дефолтный порядок начинается с `Readme.mdx` / `Readme.md`.

### Сборка падает в старом Node/webpack4 окружении

Для webpack4-проектов на современных версиях Node используйте:

```bash
NODE_OPTIONS=--openssl-legacy-provider
```

Это проблема совместимости webpack4 runtime, а не MDX-логики как таковой.

## Миграция с Markdown на MDX

Рекомендуемый поэтапный подход:

1. Оставьте существующие `.md` файлы как есть.
2. Переводите в `.mdx` по одной секции/компоненту.
3. Проверяйте импорты компонентов и docs-блоки.
4. Добавляйте кастомные MDX-плагины только после того, как базовый рендер работает стабильно.
