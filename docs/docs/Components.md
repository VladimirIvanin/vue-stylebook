# Компоненты поиска и организация стайлгайда

<!-- toc -->

- [Поиск компонентов](#%D0%BF%D0%BE%D0%B8%D1%81%D0%BA-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2)
- [Загрузка и экспорт компоненты](#%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0-%D0%B8-%D1%8D%D0%BA%D1%81%D 0%BF%D0%BE%D1%80%D1%82-%D0%BA%D0%BE%D0%BC%D0%BF%D0%BE%D0%BD%D0%B5%D0%BD%D1%82%D0%BE%D0%B2)
- [Секции](#%D1%81%D0%B5%D0%BA%D1%86%D0%B8%D0%B8)

<!-- tocstop -->

## Компоненты поиска

По умолчанию Styleguidist ищет компоненты по [glob-шаблону](https://github.com/isaacs/node-glob#glob-primer): `src/components/**/*.vue`.

Например, если ваши компоненты выглядят так: `components/Button/Button.vue`:

```javascript
module.exports = {
  components: 'src/components/**/[A-Z]*.vue'
}
```

При этом тесты отключаются:

- `__tests__` folder

> **Примечание:** Все пути указываются папки соответственно с конфигом.

> **Совет:** Используйте опцию [ignore](/Configuration.md#ignore), чтобы предотвратить возникновение ошибок из стайлгайда.

> **Примечание:** Опция [getComponentPathLine](/Configuration.md#getcomComponentpathline) меняет указанный путь под именем компонента.

## Загрузка и экспорт компонентов

По умолчанию Styleguidist _загружает_ ваши компоненты и _регистрирует_ их
глобально для примера. Чтобы избежать глобальной регистрации, викор
[locallyRegisterComponents](/Configuration.md#locallyregisterComponents). Тогда компонент будет доступен только в примерах его `ReadMe.md` или блока `<docs>`.

## Разделы

Группируйте компоненты по секциям или добавляйте документы Markdown.

каждая секция может сохранить (все поля опционально):

- `name` — заголовок раздела. `content` — путь к Markdown-файлу с описанием. `components` — glob-строка, массив путей/шаблонов или функция, возвращающая список компонентов/шаблонов. `sections` — массив вложенных секций. `description` — краткое описание раздела. `sectionDepth` — глубина вложенности с обнаружением страниц (при [pagePerSection](/Configuration.md#pagepersection)). `componentPagePerSection` — если `true` (и включен [pagePerSection](/Configuration.md#pagepersection)), ссылки на компоненты в разделах будут видны маршрутами, а не `?id=`. `exampleMode` — начальное состояние вкладки собственного кода, см. [exampleMode](/Configuration.md#examplemode). `usageMode` — начальное состояние вкладки реквизита и методов, см. [режим использования](/Configuration.md#режим использования). `ignore` — строка/массив glob-шаблонов, отслеживаемых из раздела. `href` — URL-адрес для изменений вместо раздела оценки. `external` — если задано, ссылка откроется в новом окне.

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

При необходимости компоненты в открывающейся секции открывались маршрутами из меню.
(а не прокручивались внутри раздела страницы), `componentPagePerSection`:

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
