# Начало работы

> Эта документация описывает форк `vue-styleguidist/vue-styleguidist`,
> который поддерживается в этом репозитории и деплоится в GitHub Pages.

## 1. Установка

Установите Webpack, если его еще нет. Так проверяется совместимость
вашей версии Webpack со styleguidist.

```bash
pnpm add -D webpack
```

Установите пакет форка:

```bash
pnpm add -D @ivaninvladimir/vue-styleguidist
```

Если вы используете Vue CLI 3 ([@vue/cli](https://cli.vuejs.org/)),
рекомендуется подключить плагин:

```sh
vue add styleguidist
```

Для форка эта команда устанавливает upstream-версию плагина и пакета
`vue-styleguidist`, а не `@ivaninvladimir/vue-styleguidist`.
Если важны изменения именно форка, используйте ручную настройку через
`styleguide.config.js` и npm-скрипты ниже.

Детали по интеграции смотрите в [документации для Vue CLI](/VueCLI3doc.md).

## 2. Настройка стайлгайда

Создайте файл `styleguide.config.js` в той же директории, где находится
`package.json`. Это основной файл конфигурации. В нем можно:

- [Указать Styleguidist, где лежат Vue-компоненты](Components.md)
- [Настроить загрузку вашего кода](Webpack.md)

Если вы используете [Vue-CLI 3](https://github.com/vuejs/vue-cli),
шаг с webpack можно пропустить. После установки
[vue-cli-plugin-styleguidist](/VueCLI3doc.md) нужные настройки будут
подхвачены из CLI. Останется указать путь к компонентам.

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

> NOTE: если выполнить `vue add styleguidist`, скрипты будут добавлены
> в `package.json` автоматически.

## 4. Запуск стайлгайда

Запустите **`pnpm styleguide`**, чтобы поднять dev-сервер стайлгайда.

Запустите **`pnpm styleguide:build`**, чтобы собрать статическую версию.

## 5. Сборка docs для GitHub Pages

В этом форке документация публикуется в GitHub Pages. Для сборки:

```bash
pnpm predocs
pnpm docs:build
```

Статические файлы будут в `docs/dist`.

## 6. Начните документировать компоненты

См. как [документировать компоненты](Documenting.md)

## Вопросы

- [Посмотрите cookbook](Cookbook.md)
- [Спросите в Discord](https://discordapp.com/channels/325477692906536972/538786416092512278) (нужен аккаунт [Vue Land](https://vue.land/))
- [Создайте вопрос в GitHub](https://github.com/vue-styleguidist/vue-styleguidist/issues/new?template=Question.md)
