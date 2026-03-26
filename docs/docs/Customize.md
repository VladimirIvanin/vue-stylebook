# Изменить вывод стилевых руководств

Цель этой страницы — показать, как настроить руководство по стилю.<br/>С его помощью вы сможете изменить любую часть управления по стилю. <br/>Хороший пример готового индивидуального руководства по стилю находится по ссылке [in the Examples section](/Examples#customised).

Мы пройдемся по каждому этапу процесса, чтобы вы могли полностью изменить способ отображения руководства по стилю.

> **ПРИМЕЧАНИЕ** Не происходит внешнего использования чистого CSS для стилизации компонентов styleguidist. <br/>Стилегид использует JSS для создания классов и правил. <br/>Если мы используем классы CSS, которые мы можем найти, руководство по просмотру стилей в браузере, мы вносим изменения в имена этих классов. <br/>Действительно, имена классов полностью генерируются движком JSS.

## Предварительные условия

- [Установите vue-styleguidist](GettingStarted#install) и проверь его работу. Заблокируйте вашу версию в зависимости от vue-styleguidist. Нет никаких гарантий, что ваши настройки будут работать при каждом незначительном обновлении. Для этого заголовка `package.json` и удалите `^` перед областью vue-styleguidist.
Изучите основы ReactJs. vue-styleguidist отображает руководство по стилю с помощью [react-styleguidist](https://react-styleguidist.js.org/). Вся видимая часть сделана на ReactJs. поскольку мы будем переписывать компоненты React, чем больше вы будете знать, тем больше вы сможете сделать. Установите расширение React Dev Tools в свой браузер. [Для Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
[Для Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
[Для Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

## Определить компонент

Мы хотим изменить часть руководства по стилю. Сначала нам нужно определить его имя в styleguidist.

На этом этапе мы определим, какие компоненты нам необходимо заменить, чтобы добиться трансформации.

Во-первых, начните со своего руководства по стилю.

```sh
npm run styleguide
```

Откройте руководство по стилю в браузере разработчика.<br/> Затем из инструментов разработчика вашего браузера необходимо разработать инструменты разработки.<br/> Вы должны получить что-то вроде этого

![Инструменты разработчика React](/assets/captures/ReactDevTools.png)

Во всех компонентах, показанных справа, мы можем либо изменить стили, либо заменить их своими.

Если мы хотим изменить заголовок раздела на что-то более сложное, мы находим его имя следующим образом.

## Найдите компонент

Vue Styleguidist создан на основе React-Styleguidist. Чтобы избежать дублирования, многие компоненты React-styleguidist используются из React-styleguidist.

### Посмотрите в vue-styleguidist

Чтобы найти исходный кодовый компонент, который мы хотим настроить, мы сначала ищем в [vue-styleguidist](https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-stylebook-engine/src/client/rsg-comComponents). Здесь вебпак также будет искать его в первую очередь.

> **ПРИМЕЧАНИЕ.** В этом списке нет компонентов `...Renderer` или `Styled`. Если компонент, который мы хотим настроить, заканчивается на `renderer`, мы будем искать компоненты без суффикса. Идея та же, что и с `Styled`, хотя стилизованные компоненты часто можно встретить.

### Затем в Режиме-styleguidist

Если мы не находим компонент в vue-styleguidist, это означает, что система использует компоненты из-за ответа-styleguidist. Мы ищем компонент внутри [this directory](https://github.com/styleguidist/react-styleguidist/tree/master/src/client/rsg-components).

> **ПРИМЕЧАНИЕ** Если вам приходится выбирать между изменением «...рендерера» и исходного компонента, всегда отдавайте предпочтение изменению «...рендерера». Потенциальное воздействие на подкомпоненты гораздо менее опасно.

В результате с заголовком раздела мы найдем его компонент в режиме-styleguidist [здесь](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/rsg-comComponents/Heading/HeadingRenderer.tsx)

## Стиль и тема

### Изменить тему

Чтобы сохранить единообразие руководства по стилю, мы можем заменить изменение CSS каждого компонента при обновлении темы, используя параметр конфигурации [theme](/Configuration.md#theme).

Например, если мы хотим изменить цвет ссылок, мы заглядываем внутрь [кода ссылок](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/rsg-comComponents/Link/LinkRenderer.tsx). Мы обнаружили, что цвет ссылок определяется входным значением `color.link`. Теперь все, что применяется в качестве параметра функции `Style`, берется из темы.

```js
const styles = ({ color }: Rsg.Theme) => ({
  link: {
    '&, &:link, &:visited': {
      fontSize: 'inherit',
      color: color.link,
      textDecoration: 'none'
    },
    '&:hover, &:active': {
      isolate: false,
      color: color.linkHover,
      cursor: 'pointer'
    }
  }
})
```

Итак, если мы хотим изменить все цвета ссылок в темах, мы поместим это в наш `styleguide.config.js`.

```js
// styleguide.config.js
export default {
  theme: {
    color: {
      link: 'hotpink'
    }
  }
}
```

поскольку vue-styleguidist основан на mode-styleguidist, они используют одну и ту же [внутреннюю тему] (https://github.com/styleguidist/react-styleguidist/blob/master/src/typings/RsgTheme.ts).

Предоставленный нам объект `theme` будет объединен с [standard theme](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.ts) и включен во все компоненты, которые примут его в качестве параметра.

### Стилизованные компоненты

Если мы хотим настроить стили отдельного компонента и хотим получить вывод HTML плюс внутреннюю логику, мы можем использовать параметры [styles](/Configuration.md#styles) в нашем `styleguide.config.js`.

Поскольку мы хотим изменить раздел заголовка и предыдущий найденный компонент, мы изменим стили, найденные выше компонента `Heading`.

Начнем с просмотра компонентов [original styles](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/rsg-components/Heading/HeadingRenderer.tsx#L7-L34).

```js
const styles = ({ color, fontFamily, fontSize }: Rsg.Theme) => ({
  heading: {
    margin: 0,
    color: color.base,
    fontFamily: fontFamily.base,
    fontWeight: 'normal'
  },
  heading1: {
    fontSize: fontSize.h1
  },
  heading2: {
    fontSize: fontSize.h2
  },
  heading3: {
    fontSize: fontSize.h3
  },
  heading4: {
    fontSize: fontSize.h4
  },
  heading5: {
    fontSize: fontSize.h5,
    fontWeight: 'bold'
  },
  heading6: {
    fontSize: fontSize.h6,
    fontStyle: 'italic'
  }
})
```

Чтобы цвет заголовка был зеленым, мы обновляем экономический стиль `heading2`. Для этого мы добавим эту конфигурацию в наш файл.

```js
// styleguide.config.js
export default {
  styles: {
    // First level of keys will be the component name
    Heading: {
      // Second level will be the class name
      heading2: {
        // Finally we use JSS to style the components
        color: 'green'
      }
    }
  }
}
```

Все приведенные выше стили используют JSS для рендеринга стилей.

Обратитесь к [JSS documentation](https://cssinjs.org/), чтобы понять, какое значение могут иметь параметры JSS.

## Изменить компоненты

Если изменений недостаточно и мы хотим добавить контент или изменить HTML, возвращаемый нашим компонентом, мы сможем полностью их переопределить.

Мы нашли компонент, который хотим переопределить. Поскольку у нас есть доступ к исходному коду исходного компонента, мы скопируем и вставим файлы в вашу базу кода.

Не копируйте тестовые файлы, если они имеются (они заканчиваются в .spec.js,ts или tsx). Они неоправданно усложнили процесс. Вам предстоит подготовить шутку с Babel и Typescript на собственной кодовой базе, чтобы правильно запустить эти тесты.

## Регистрация компонентов

Теперь, когда у нас есть файлы компонентов, которые мы хотим изменить, мы должны сообщить vue-styleguidist, где они находятся. Для этого обновите параметр [styleguideComponents](/Configuration.md#styleguidecomComponents) в `styleguide.config.js`, указав путь к созданию новых файлов компонента.

## Настройка бабеля

Теперь, когда у нас есть наши компоненты кода, мы видим, что компоненты используют синтаксис JSX из состояния. Этот синтаксис **отличается** от синтаксиса VueJ. Эти два синтаксиса несовместимы. Поэтому даже если мы будем использовать JSX в наших компонентах Vue, нам придется изменить конфигурацию Babel.

Пример конфигурации вы можете просмотреть в исходной таблице [customized](https://vue-styleguidist.github.io/Examples.html#customized).

Не забудьте установить `@babel/plugin-transform-react-jsx` в зависимости от вашего разработчика.

```js
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-transform-runtime'],
  comments: false,
  overrides: [
    {
      // only process jsx with react style for styleguide components
      include: ['**/styleguide/components/*.{js,vue}'],
      plugins: ['@babel/plugin-transform-react-jsx']
    },
    {
      // For vue components process jsx with the vue style
      include: ['**/src/components/**/*.jsx'],
      plugins: ['transform-vue-jsx']
    }
  ]
}
```

Теперь мы можем изменить принципы использования файлового компонента. Как только мы запустили среду разработки руководства по стилю, каждое сохранение нашего нового компонента файла будет отражаться при рендеринге с использованием замен модуля hotm.

Удачной работы со Styleguidist!
