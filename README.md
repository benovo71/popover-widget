# Popover Widget 🎈

[![Build Status](https://github.com/benovo71/popover-widget/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/benovo71/popover-widget/actions)

[🔗 Live Demo](https://benovo71.github.io/popover-widget/)

## 📋 Описание

Реализация всплывающего виджета **Popover** на чистом JavaScript (без jQuery), вдохновлённая Bootstrap.

### ✨ Особенности:

- Показ всегда **сверху** от элемента-триггера
- **Горизонтальное центрирование** относительно триггера
- Позиционирование в **пикселях** (без `translate`/`transform`)
- Закрытие по клику вне виджета и по `Escape`
- Полная поддержка **BEM**-методологии в стилях
- Покрытие тестами (**JSDOM + Jest**)

## 🛠 Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск дев-сервера
npm start

# Сборка для продакшена
npm run build

# Запуск тестов
npm test

# Линтинг
npm run lint
```
