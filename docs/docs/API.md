# API Node.js

<!-- содержание -->

- [Initialization](#initialization)
- [Methods](#methods)

<!-- toc -->

- [Инициализация](#%D0%B8%D0%BD%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F)
- [Методы](#%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D1%8B)

<!-- tocstop -->

## Инициализация

Во-первых, вам необходимо создать API для конфигурации вашего управления по стилю.

Использование объекта JavaScript:

```javascript
const styleguidist = require('vue-styleguidist')
const styleguide = styleguidist({
  logger: {
    warn: console.warn,
    info: console.log,
    debug: console.log
  },
  components: './lib/components/**/*.vue',
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader?modules'
        }
      ]
    }
  }
})
```

Использование файла конфигурации:

```javascript
const styleguidist = require('vue-styleguidist')
const styleguide = styleguidist(require('../styleguide.config.js'))
```

Или автоматический поиск файла конфигурации:

```javascript
const styleguidist = require('vue-styleguidist')
const styleguide = styleguidist()
```

Посмотреть все доступные [config options](/Configuration.md).

> **Примечание.** вывод консоли по умолчанию отключен. Возможно, вам удастся определить свой участок [logger](/Configuration.md#logger).

## Методы

### `build(callback)`

#### Аргументы

1. `callback(err, config, stats)` (_Function_): обратный вызов, который будет сохраняться при построении управления по стилю:

1. `err` (_Объект_): сведения о деньгах. 2. `config` (_Объект_): нормализованная конфигурация управления по стилю. 3. `stats` (_Объект_): статистика сборки веб-пакета.

#### Возврат

(_Компилятор_): пример веб-пакета `Compiler`.

#### Пример

```javascript
const styleguidist = require('vue-styleguidist')
styleguidist(require('../styleguide.config.js')).build(
  (err, config) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Style guide published to', config.styleguideDir)
    }
  }
)
```

### `server(callback)`

#### Аргументы

1. `callback(err, config)` (_Function_): обратный вызов, который будет сохраняться при построении управления по стилю:

1. `err` (_Объект_): сведения о деньгах. 2. `config` (_Объект_): нормализованная конфигурация управления по стилю.

#### Возврат

(_Object_): объект, состоящий из экземпляра веб-пакета `Compiler` и vue-styleguidist `Server`.

#### Пример

```javascript
const styleguidist = require('vue-styleguidist')
styleguidist(require('../styleguide.config.js')).server(
  (err, config) => {
    if (err) {
      console.log(err)
    } else {
      const url = `http://${config.serverHost}:${config.serverPort}`
      console.log(`Listening at ${url}`)
    }
  }
)
```

### `makeWebpackConfig([env])`

#### Аргументы

1. \[`env`=`'production'`\] (_String_): `production` или `development`.

#### Возврат

(_Object_): внешний вид веб-пакета.

#### Пример

```javascript
// webpack.config.js
module.exports = [
  {
    // User webpack config
  },
  require('vue-styleguidist')().makeWebpackConfig()
]
```
