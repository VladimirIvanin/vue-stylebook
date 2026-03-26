# Движок Vue REPL

`vue-styleguidist` поддерживает движок playground для Vue 3 на базе `@vue/repl`.

Этот движок включается явно (opt-in) и не требует отдельного standalone server.
Он работает внутри того же процесса dev server, что и Styleguidist.

## Быстрый старт

1. Установите зависимость Vue REPL:

```bash
pnpm add -D @vue/repl
```

2. Включите новый движок в `styleguide.config.js`:

```js
module.exports = {
  playgroundEngine: 'vueRepl'
}
```

3. Запустите styleguidist как обычно:

```bash
pnpm vue-styleguidist server
```

## Разрешение runtime

Runtime для sandbox выбирается в таком порядке:

1. Runtime из Storybook Vite cache (`node_modules/.cache/storybook/*/sb-vite/deps/vue.js`)
2. Локальный runtime из `node_modules/@vue/runtime-dom/dist/runtime-dom.esm-browser.js`
3. Fallback в состояние unresolved с явным предупреждением в playground

Цель — избежать несовпадения runtime между локальным приложением, Storybook cache
и iframe Vue REPL.

Путь к server renderer определяется из:

- `node_modules/@vue/server-renderer/dist/server-renderer.esm-browser.js`

Styleguidist раздает его через внутренние endpoint-ы:

- `/__vsg-runtime/vue`
- `/__vsg-runtime/vue-server-renderer`

Дополнительный процесс не нужен.

## Автоматическая реинициализация и HMR

Когда Styleguidist обнаруживает hot update данных индекса docs/components, он
отправляет событие `vsg:dist-rebuilt` в клиентском runtime.

В режиме `vueRepl` playground слушает это событие и перемонтирует sandbox, поэтому
при редактировании SFC-файлов компонента preview надежно переинициализируется.

## Область поддержки Vue 3

Текущая область реализации:

- только Vue 3
- `@vue/repl` с editor CodeMirror
- legacy-движок (`vue-inbrowser-compiler`) остается режимом по умолчанию и полностью поддерживается

Если в проекте все еще используются examples на Vue 2, оставьте:

```js
module.exports = {
  playgroundEngine: 'legacy'
}
```

## Troubleshooting

### REPL ведет себя как при runtime mismatch

- Убедитесь, что версии `vue`, `@vue/runtime-dom` и `@vue/server-renderer` согласованы.
- При необходимости удалите устаревший cache:

```bash
rm -rf node_modules/.cache/storybook
```

После этого перезапустите Styleguidist.

### REPL не может загрузить runtime

- Проверьте, что локальные файлы существуют:
  - `node_modules/@vue/runtime-dom/dist/runtime-dom.esm-browser.js`
  - `node_modules/@vue/server-renderer/dist/server-renderer.esm-browser.js`
- Проверьте, что endpoint-ы dev server отвечают:
  - `http://localhost:6060/__vsg-runtime/vue`
  - `http://localhost:6060/__vsg-runtime/vue-server-renderer`

### Legacy playground работает, а REPL — нет

- Убедитесь, что проект/ runtime действительно на Vue 3.
- Убедитесь, что в итоговом конфиге включено `playgroundEngine: 'vueRepl'`.
- Убедитесь, что `@vue/repl` установлен в workspace.

## Миграция с legacy

Рекомендуемый путь миграции:

1. Переведите один package / группу examples на `playgroundEngine: 'vueRepl'`.
2. Проверьте цикл HMR-обновлений и корректность разрешения runtime.
3. Сохраните regression-проверки для legacy examples.
4. После валидации распространите изменения на все examples Vue 3.

Откат выполняется сразу: переключите `playgroundEngine` обратно в `legacy`.
