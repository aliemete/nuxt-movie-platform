# nuxt-movie-platform
A modern movie discovery app with auth, favorites, and search. Built with Nuxt 3, Vue 3, and Cinemaguide API. Features SSR, responsive design, and genre filtering.  #Nuxt3 #Vue #Pinia #Movies


Описание проекта

Nuxt Movie Platform - это веб-приложение для поиска и просмотра информации о фильмах. Основные возможности:

Просмотр случайных фильмов и топ-10

Поиск фильмов по названию

Фильтрация по жанрам

Авторизация и регистрация пользователей

Добавление фильмов в избранное

Просмотр трейлеров

Детальная информация о фильмах

Проект использует API киногида Skillbox (https://cinemaguide.skillbox.cc) для получения данных о фильмах.

Технологии
Nuxt 3 (SSR)

TypeScript

Pinia (глобальное состояние)

Vue 3 Composition API

SCSS/CSS
Установка и запуск
Склонируйте репозиторий:

bash
git clone https://github.com/your-username/nuxt-movie-platform.git
cd nuxt-movie-platform
Установите зависимости:

bash
npm install
Запустите проект в режиме разработки:

bash
npm run dev
Для production сборки:

bash
npm run build
npm run preview
Особенности реализации
Авторизация
Реализована через Pinia-хранилище auth.ts

Поддержка регистрации, входа и выхода

Валидация полей формы

Модальное окно авторизации

Работа с фильмами
Компонент Movie.vue для отображения карточки фильма

Компонент MovieGrid.vue для сетки фильмов

Поиск по названию с автодополнением

Добавление/удаление из избранного

API
Все запросы к API вынесены в composables/fetch.ts

Поддержка всех основных эндпоинтов API киногида

Конфигурация
Основные настройки в nuxt.config.ts:

SSR режим

Глобальные стили

Модули (Pinia, Nuxt Image)

Настройки роутинга

Лицензия
MIT
