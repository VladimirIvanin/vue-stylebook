# Команды и опции CLI

## Команды

- `vue-styleguidist server`: запустить dev-сервер.
- `vue-styleguidist build`: собрать статический HTML-стайлгайд.

## Опции

| Опция             | Описание                                 |
| ----------------- | ---------------------------------------- |
| `--config <file>` | Указать путь к конфигурационному файлу   |
| `--open`          | Открыть Styleguidist в браузере по умолчанию |
| `--verbose`       | Выводить отладочную информацию           |

## Использование

Добавьте эти команды в раздел `scripts` вашего `package.json`:

```json
{
  "scripts": {
    "styleguide": "vue-styleguidist server",
    "styleguide:build": "vue-styleguidist build"
  }
}
```
