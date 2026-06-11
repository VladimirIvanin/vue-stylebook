# Использование с Vue CLI 3

С Vue CLI 3 разработчик может подготовить рабочее окружение за минуты. Выполните `vue create myProject` и можно начинать писать на Vue.js. Также это упрощает старт со styleguidist.

## Установка

Чтобы добавить `styleguidist`, откройте терминал в папке приложения и выполните:

```sh
vue add styleguidist
```

Для форка эта команда ставит upstream-плагин `vue-cli-plugin-styleguidist`, который тянет `vue-styleguidist`, а не `@ivaninvladimir/vue-stylebook`. Если нужен именно форк, установите его напрямую:

```sh
pnpm add -D @ivaninvladimir/vue-stylebook
```

и добавьте скрипты вручную:

```json
{
  "scripts": {
    "styleguide": "vue-stylebook server",
    "styleguide:build": "vue-stylebook build"
  }
}
```

Vue Styleguidist автоматически настроится и добавит несколько примеров для старта. Будут подготовлены webpack-конфиг, Hot Module Reloading и пример стайлгайда. При необходимости измените `styleguide.config.js` под свой проект.

> **Note** Если хотите использовать `styleguidist` с CLI без плагина, это возможно: установите `styleguidist` обычным способом. Но официальной поддержки такого сценария нет.
>
> Возможно, потребуется вручную убрать HMR из CLI, так как он может конфликтовать с HMR styleguidist и вызывать бесконечный цикл обновлений. См. [issue 290](https://github.com/vue-styleguidist/vue-styleguidist/issues/290)

## Vue UI

Vue Styleguidist совместим с Vue UI. Если хотите настраивать `styleguidist` через графический интерфейс, откройте консоль и выполните:

```sh
vue ui
```

В настройках плагинов будут доступны переключатели для конфигурации стайлгайда.
