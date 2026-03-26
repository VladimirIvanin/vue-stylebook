# Начало работы

> В этой документации описана вилка `vue-styleguidist/vue-styleguidist`,
> который открывается в этом репозитории и разворачивается на страницах GitHub.

## 1. Установка

Установите Webpack, если его еще нет. Таково взаимодействие
Ваша версия Webpack со стилем управления.

```bash
pnpm add -D webpack
```

Выберите пакетную форку:

```bash
pnpm add -D @ivaninvladimir/vue-styleguidist
```

Если вы используете Vue CLI 3 (@vue/cli](https://cli.vuejs.org/)),
рекомендуемый разъем:

```sh
vue add styleguidist
```

Для форка эта команда устанавливает плагин и пакет вышестоящей версии.
`vue-styleguidist`, а не `@ivaninvladimir/vue-styleguidist`. Если важны изменения именно вилки, используйте ручную ручку через
`styleguide.config.js` и npm-скрипты ниже.

Подробности смотрите в [документации для Vue CLI](/VueCLI3doc.md).

##2. Настройка стайлгайда

Создайте файл `styleguide.config.js` в той же директории, где находится
`package.json`. Это основной файл конфигурации. В нем можно:

- [Указать Styleguidist, где оставить Vue-компоненты](Components.md)
- [Настроить загрузку вашего кода](Webpack.md)

Если вы используете [Vue-CLI 3](https://github.com/vuejs/vue-cli),
шаг с веб-пакетом можно пропустить. После установки
[vue-cli-plugin-styleguidist](/VueCLI3doc.md) нужные настройки
подхвачены из CLI. Остается путь к компонентам.

## 3. Добавьте удобные скрипты

Добавьте эти скрипты в `package.json`:

```diff
{
  "scripts": {
+    "styleguide": "vue-styleguidist server",
+    "styleguide:build": "vue-styleguidist build"
  }
}
```

Для Vue-CLI 3 используйте так:

```diff
{
  "scripts": {
+    "styleguide": "vue-cli-service styleguidist",
+    "styleguide:build": "vue-cli-service styleguidist:build"
  }
}
```

> ПРИМЕЧАНИЕ: при настройке `vue add styleguidist` скрипты будут добавлены.
> в `package.json` автоматически.

## 4. Запуск стайлгайда

Запустите **`pnpm styleguide`**, чтобы поднять dev-сервер стайлгайда.

Запустите **`pnpm styleguide:build`**, чтобы собрать статическую версию.

## 5. Сборка документации для страниц GitHub

В этом форке документация публикуется на GitHub Pages. Для сборки:

```bash
pnpm predocs
pnpm docs:build
```

Статические файлы будут в `docs/dist`.

## 6. Включить документацию компонентов

См. как [документировать компоненты](Documenting.md)

## Вопросы

- [Посмотрите практические сценарии](Cookbook.md)
- [Создайте вопрос на GitHub](https://github.com/vue-styleguidist/vue-styleguidist/issues/new/choose)