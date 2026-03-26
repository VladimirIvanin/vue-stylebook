# Настройка Webpack

Vue Styleguidist использует [webpack](https://webpack.js.org/) под капотом и должен знать, как загружать файлы вашего проекта.

_Webpack нужен для запуска Vue Styleguidist, но ваш проект не обязан использовать Webpack напрямую._

> **Примечание.** Дополнительные примеры см. в разделе [cookbook](Cookbook.md).

<!-- содержание -->

- [Повторное использование конфигурации Webpack вашего проекта](#reusing-your-projects-webpack-config)
- [Пользовательская конфигурация Webpack](#custom-webpack-config)
- [Когда ничего не работает](#когда-ничего-не-работает)

<!-- tocstop -->

## Повторное использование конфигурации Webpack вашего проекта

По умолчанию Styleguidist попытается найти `webpack.config.js` в корневом каталоге вашего проекта и его использовать.

Если ваш конфиг Webpack лежит в другом месте, подключите его вручную из `styleguide.config.js`:

```javascript
// ./styleguide.config.js
module.exports = {
  webpackConfig: require('./configs/webpack.js')
}
```

Или, если вы хотите объединить его с другими опциями:

```javascript
// ./styleguide.config.js
module.exports = {
  webpackConfig: Object.assign({}, require('./configs/webpack.js'), {
    /* Custom config options */
  })
}
```

> **Примечание.** Параметры `entry`, `externals`, `output`, `watch` и `stats` будут находиться рядом. Для производственной сборки `devtool` также будет ограждение.

> **Примечание:** плагины `CommonsChunkPlugins`, `HtmlWebpackPlugin`, `UglifyJsPlugin`, `HotModuleReplacementPlugin` будут включены, поскольку Styleguidist уже включает их, иначе они могут нарушить работу Styleguidist.

> **Примечание.** Если ваши загрузчики не работают со Styleguidist, создайте форму абсолютных путей `include` и `exclude`.

> **Примечание.** Конфигурации веб-пакетов Babelified (например, `webpack.config.babel.js`) не показаны. Мы рекомендуем изменить вашу конфигурацию в саду Узел — опоры Узел 6 [многие функции ES6](http://node.green/).

> **Примечание.** Используйте [webpack-merge](https://github.com/survivejs/webpack-merge) для упрощения объединения конфигураций.

## Пользовательская конфигурация веб-пакета

Добавьте раздел `webpackConfig` в свой `styleguide.config.js`:

```javascript
// ./styleguide.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  webpackConfig: {
    module: {
      rules: [
        // Vue loader
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }
      ]
    },
    plugins: [
      // add vue-loader plugin
      new VueLoaderPlugin()
    ]
  }
}
```

> **Внимание:** Эта опция отключает загрузку конфигурации из `webpack.config.js`, см. выше, как загрузить конфигурацию вручную.

> **Примечание.** Параметры `entry`, `externals`, `output`, `watch` и `stats` будут находиться рядом. Для производственной сборки `devtool` также будет ограждение.

> **Примечание:** плагины `CommonsChunkPlugins`, `HtmlWebpackPlugin`, `UglifyJsPlugin`, `HotModuleReplacementPlugin` будут включены, поскольку Styleguidist уже включает их, иначе они могут нарушить работу Styleguidist.

> **Примечание**. Ожидается, что в вашем проекте уже есть зависимость `vue-loader`.

## Когда ничего больше не работает

В очень редких случаях, например, при использовании кондиционера или входе в библиотеку, вы можете изменить параметры веб-пакета, которые Styleguidist не позволяет изменять параметры с помощью `webpackConfig`. В этом случае вы можете использовать опцию [dangerousUpdateWebpackConfig](/Configuration.md#dangerousupdatewebpackconfig).

> **Внимание:** с этими параметрами легко сломать Vue Styleguidist. Если нет явной необходимости, лучше использовать опцию `webpackConfig`.