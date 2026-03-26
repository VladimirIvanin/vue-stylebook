# MDX

Vue Styleguidist поддерживает файлы `.mdx` как для разделов контента, так и
для примеров компонентов. Это позволяет использовать обычную документацию в
Markdown и более гибкие MDX-документы с JSX/ESM.

> Поддержка MDX является дополнительной: существующие `.md` файлы продолжают
> работать как раньше.

<!-- toc -->

- [Что поддерживается](#%D1%87%D1%82%D0%BE-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B8%D0%B2%D0%B0%D0%B5%D1%82%D1%81%D1%8F)
- [Как выбираются файлы](#%D0%BA%D0%B0%D0%BA-%D0%B2%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D1%8E%D1%82%D1%81%D1%8F-%D1%84%D0%B0%D0%B9%D0%BB%D1%8B)
- [Совместимость с блоками Storybook](#%D1%81%D0%BE%D0%B2%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D1%8C-%D1%81-%D0%B1%D0%BB%D0%BE%D0%BA%D0%B0%D0%BC%D0%B8-storybook)
- [Конфигурация](#%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B3%D1%83%D1%80%D0%B0%D1%86%D0%B8%D1%8F)
- [Использование MDX в секциях](#%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-mdx-%D0%B2-%D1%81%D0%B5%D0%BA%D1%86%D0%B8%D1%8F%D1%85)
- [Использование MDX в качестве примеров компонентов](#%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-mdx-%D0%B2-%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B5-%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D0%BE%D0%B2-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2)
- [Использование `@example` с MDX](#%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-example-%D1%81-mdx)
- [Готовые примеры MDX](#%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D1%8B%D0%B5-%D0%BF%D1%80%D0%B8%D0%BC%D0%B5%D1%80%D1%8B-mdx)
- [Ограничения и отличия от Storybook](#%D0%BE%D0%B3%D1%80%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B8-%D0%BE%D1%82%D0%BB%D0%B8%D1%87%D0%B8%D1%8F-%D0%BE%D1%82-storybook)
- [Решение проблем](#%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BF%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC)
- [Миграция с Markdown на MDX](#%D0%BC%D0%B8%D0%B3%D1%80%D0%B0%D1%86%D0%B8%D1%8F-%D1%81-markdown-%D0%BD%D0%B0-mdx)

<!-- tocstop -->

## Что поддерживается

- Файлы `.mdx` компилируются через `@mdx-js/mdx`.
- Включены расширения GFM (`remark-gfm`), поэтому работают таблицы и fenced-код.
- Для заголовков и внешних ссылок используются `rehype-slug` и `rehype-external-links`.
- Внутри MDX можно использовать ESM-импорт и экспорт.
- MDX поддерживается в:
  - `content` разделов;
  - файлах примеров, найденных через `getExampleFilename`;
  - ссылках doclet вида `@example ./path/to/file.mdx`.

## Как выбираются файлы

По умолчанию Vue Styleguidist ищет файлы примеров в таком порядке:

1. `Readme.mdx`
2. `Readme.md`
3. `ComponentName.mdx`
4. `ComponentName.md`

Если найден файл `.mdx`, используется загрузчик MDX. Если найден `.md`, используется существующий загрузчик Markdown.

## Совместимость с блоками Storybook

Для переноса документации из Storybook в Vue Styleguidist есть слой совместимости блоков.

Сейчас используются блоки:

- `Meta`
- `Canvas`
- `Story`
- `Source`

Рекомендуемый импорт для проектов на Vue Styleguidist:

```mdx
import { Meta, Canvas, Source } from '@vue-styleguidist/blocks'
```

Также поддерживается импорт в стиле Storybook:

```mdx
import { Meta, Canvas, Source } from '@storybook/blocks'
```

`Meta` в Vue Styleguidist работает как контейнер метаданных (без отдельного
рендеринга). `Canvas` и `Story` отображают совместимые контейнеры контента.
`Source` рендерит блоки кода.

## Конфигурация

### `mdxCompileOptions`

Тип: `Object`, по умолчанию: `{}`

Дополнительные параметры компиляции в MDX-пайплайне. Можно использовать для
добавления своих `remark`/`rehype` плагинов или переопределения
`providerImportSource`.

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

Включает встроенные алиасы `@vue-styleguidist/blocks` и `@storybook/blocks` на слой совместимости.
Установите `false`, если хотите настроить алиасы вручную через конфигурацию Webpack.

```js
module.exports = {
  storybookBlocks: true
}
```

## Использование MDX в секциях

Можно напрямую использовать `.mdx` в разделе `content`:

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

## Использование MDX в качестве примеров компонентов

Если в компоненте есть `Readme.mdx`, он будет автоматически загружен дефолтной конфигурацией.

Это поведение можно переопределить:

```js
module.exports = {
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.vue$/, '.examples.mdx')
  }
}
```

## Использование `@example` с MDX

Доклетка `@example` может ссылаться на MDX-файлы:

```js
/**
 * Button docs
 * @example ./Button.docs.mdx
 */
export default {
  name: 'Button'
}
```

`@example [none]` по-прежнему работает и скрывает связанный пример.

## Готовые примеры MDX

Ниже несколько рабочих шаблонов, которые можно копировать и адаптировать.

### 1) Базовая страница секции

```mdx
import { Meta, Source } from '@vue-styleguidist/blocks'

<Meta title="Гайды/Быстрый старт" />

# Быстрый старт

Описание раздела в markdown.

<Source language="bash" code={`
pnpm install
pnpm styleguide
`} />
```

### 2) Canvas с namespace-импортом (паттерн Storybook)

```mdx
import { Meta, Canvas } from '@vue-styleguidist/blocks'
import * as Stories from './Button.stories'

<Meta of={Stories} title="Компоненты/Button" />

# Button

<Canvas of={Stories.Base} />
```

### 3) Story с именованным импортом

```mdx
import { Meta, Story } from '@vue-styleguidist/blocks'
import { Primary } from './Button.stories'

<Meta title="Компоненты/Button/Primary" />
<Story of={Primary} />
```

### 4) Таблица с данными из `export const`

```mdx
export const args = {
  resize: {
    examples: '`v-overflow`\\n`v-overflow:resize`',
    description: 'Обновлять состояние при resize'
  }
}

| Режим     | Пример                 | Описание                  |
| --------- | ---------------------- | ------------------------- |
| `:resize` | {args.resize.examples} | {args.resize.description} |
```

### 5) Source как справочный блок кода

```mdx
import { Source } from '@vue-styleguidist/blocks'

<Source
  language="ts"
  code={`
export interface Payload {
  id: string
  title: string
}
`}
/>
```

### 6) MDX как `Readme.mdx` компонента

Создайте рядом с компонентом файл `Readme.mdx`:

```mdx
import { Meta, Canvas } from '@vue-styleguidist/blocks'
import * as Stories from './Button.stories'

<Meta of={Stories} title="Компоненты/Button" />

# Button

Краткое описание компонента.
<Canvas of={Stories.Base} />
```

Vue Styleguidist подхватит его автоматически.

### 7) MDX через `@example`

```js
/**
 * Кнопка формы
 * @example ./Button.docs.mdx
 */
export default {
  name: 'Button'
}
```

### 8) Импорт в стиле Storybook (совместимость)

```mdx
import { Meta, Canvas, Story, Source } from '@storybook/blocks'
```

Для новых проектов рекомендуется:

```mdx
import { Meta, Canvas, Story, Source } from '@vue-styleguidist/blocks'
```

### 9) Section-конфиг с `.mdx`

```js
module.exports = {
  sections: [
    {
      name: 'Документация',
      content: 'docs/introduction.mdx'
    },
    {
      name: 'Компоненты',
      components: 'src/components/**/*.vue'
    }
  ]
}
```

### 10) Кастомный `getExampleFilename` под `.examples.mdx`

```js
module.exports = {
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.vue$/, '.examples.mdx')
  }
}
```

## Ограничения и отличия от Storybook

- Vue Styleguidist не запускает runtime Storybook.
- Слой совместимости покрывает типовые сценарии миграции MDX-документации.
- Часть продвинутых возможностей Storybook не имеет полного соответствия 1:1.

Если вы сильно зависите от специфики выполнения документов Storybook, лучше использовать простые совместимые блоки и явно импортируемые компоненты в MDX.

## Решение проблем

### `Cannot find module '@storybook/blocks'`

Оставьте `storybookBlocks: true` (по умолчанию) или задайте небольшой псевдоним в webpack-конфиге.

### MDX компилируется, но рендеринг выглядит некорректно.

Проверьте пользовательские плагины в `mdxCompileOptions`. Временно отключите их
и включайте обратно по одному.

### Файл `.mdx` не подхватывается как пример компонента

Проверьте результат `getExampleFilename` и корректность путей. Помните, что
порядок поиска по умолчанию начинается с `Readme.mdx` / `Readme.md`.

### Сборка падает в старом режиме Node/webpack4

Для проектов на Webpack 4 в современных версиях Node используйте:

```bash
NODE_OPTIONS=--openssl-legacy-provider
```

Это проблема совместимости рантайма Webpack 4, а не логики MDX.

## Миграция с Markdown на MDX

Рекомендуемый поэтапный подход:

1. Оставьте существующие `.md` файлы как есть.
2. Переносите в `.mdx` по одному разделу или компоненту.
3. После каждого шага проверяйте импорты компонентов и `<docs>`-блоки.
4. Пользовательские MDX-плагины добавляйте только после стабилизации базового рендера.
