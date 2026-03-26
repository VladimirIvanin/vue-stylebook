# Поиск компонентов и организация стайлгайда

<!-- toc -->

- [Поиск компонентов](#%D0%BF%D0%BE%D0%B8%D1%81%D0%BA-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2)
- [Загрузка и экспорт компонентов](#%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0-%D0%B8-%D1%8D%D0%BA%D1%81%D0%BF%D0%BE%D1%80%D1%82-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2)
- [Секции](#%D1%81%D0%B5%D0%BA%D1%86%D0%B8%D0%B8)

<!-- tocstop -->

## Поиск компонентов

По умолчанию Styleguidist ищет компоненты по [glob-шаблону](https://github.com/isaacs/node-glob#glob-primer): `src/components/**/*.vue`.

Например, если ваши компоненты выглядят так: `components/Button/Button.vue`:

```javascript
module.exports = {
  components: 'src/components/**/[A-Z]*.vue'
}
```

При этом тесты игнорируются:

- `__tests__` folder

> **Note:** Все пути указываются относительно папки с конфигом.

> **Совет:** Используйте опцию [ignore](/Configuration.md#ignore), чтобы исключить файлы из стайлгайда.

> **Note:** Опция [getComponentPathLine](/Configuration.md#getcomponentpathline) меняет строку пути под именем компонента.

## Загрузка и экспорт компонентов

По умолчанию Styleguidist _загружает_ ваши компоненты и _регистрирует_ их
глобально для примеров. Чтобы избежать глобальной регистрации, используйте
[locallyRegisterComponents](/Configuration.md#locallyregistercomponents).
Тогда компонент будет доступен только в примерах его `ReadMe.md` или блока `<docs>`.

## Секции

Группируйте компоненты по секциям или добавляйте отдельные Markdown-документы.

Каждая секция может содержать (все поля опциональны):

- `name` — заголовок секции.
- `content` — путь к Markdown-файлу с описанием.
- `components` — glob-строка, массив путей/шаблонов или функция, возвращающая список компонентов/шаблонов.
- `sections` — массив вложенных секций.
- `description` — краткое описание секции.
- `sectionDepth` — глубина вложенности с отдельными страницами (при [pagePerSection](/Configuration.md#pagepersection)).
- `componentPagePerSection` — если `true` (и включен [pagePerSection](/Configuration.md#pagepersection)), ссылки на компоненты в секции будут отдельными маршрутами, а не `?id=`.
- `exampleMode` — начальное состояние вкладки примера кода, см. [exampleMode](/Configuration.md#examplemode).
- `usageMode` — начальное состояние вкладки props и methods, см. [usageMode](/Configuration.md#usagemode).
- `ignore` — строка/массив glob-шаблонов, исключаемых из секции.
- `href` — URL для перехода вместо содержимого секции.
- `external` — если задано, ссылка откроется в новом окне.

Пример конфигурации стайлгайда с текстовой документацией и списком компонентов:

```javascript
module.exports = {
  sections: [
    {
      name: 'Introduction',
      content: 'docs/introduction.md'
    },
    {
      name: 'Documentation',
      sections: [
        {
          name: 'Installation',
          content: 'docs/installation.md',
          description: 'The description for the installation section'
        },
        {
          name: 'Configuration',
          content: 'docs/configuration.md'
        },
        {
          name: 'Live Demo',
          external: true,
          href: 'http://example.com'
        }
      ]
    },
    {
      name: 'UI Components',
      content: 'docs/ui.md',
      components: 'lib/components/ui/*.vue'
    }
  ]
}
```

Если нужно, чтобы компоненты в секции открывались отдельными маршрутами из меню
(а не прокручивались внутри страницы секции), включите `componentPagePerSection`:

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
