# Команды и опции CLI

Для проектов на этом форке установите пакет так:

```bash
pnpm add -D @ivaninvladimir/vue-stylebook
```

## Команды

- `vue-stylebook server`: запустить dev-сервер. `vue-stylebook build`: сборный статический HTML-стайлгайд.

## Опции

| Опция             | Описание                                     |
| ----------------- | -------------------------------------------- |
| `--config <file>` | Указать путь к конфигурационному файлу       |
| `--open`          | Открытие Styleguided в браузере по умолчанию |
| `--verbose`       | Вывести отладочную информацию                |

## Использование

Добавьте эти команды в раздел `scripts` вашего `package.json`:

```json
{
  "scripts": {
    "styleguide": "vue-stylebook server",
    "styleguide:build": "vue-stylebook build"
  }
}
```
