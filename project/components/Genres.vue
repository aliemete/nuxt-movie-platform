<script setup lang="ts">
import { ref, computed } from 'vue';
import { fetchGenres, fetchMoviesByGenre, fetchGenresWithPosters } from '../composables/fetch';
import type { Movie } from '~/types/types';
import MovieGrid from '~/components/MovieGrid.vue';
// import fallbackImage from '~/assets/img/no-poster.jpg';

const selectedGenre = ref<string | null>(null);
const genres = ref<string[]>([]);
const movies = ref<Movie[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

// Функция перевода жанров (оставляем как есть)
const translateGenre = (genre: string): string => {
  const translations: Record<string, string> = {
    'history': 'Исторический',
    'horror': 'Ужасы',
    'scifi': 'Научная фантастика',
    'stand-up': 'Стендап',
    'fantasy': 'Фэнтези',
    'drama': 'Драма',
    'mystery': 'Мистика',
    'family': 'Семейный',
    'comedy': 'Комедия',
    'romance': 'Мелодрама',
    'music': 'Музыкальный',
    'crime': 'Криминал',
    'tv-movie': 'Телефильм',
    'documentary': 'Документальный',
    'action': 'Боевик',
    'thriller': 'Триллер',
    'western': 'Вестерн',
    'animation': 'Мультфильм',
    'war': 'Военный',
    'adventure': 'Приключения'
  };
  
  return translations[genre.toLowerCase()] || genre;
};

// Вычисляемое свойство для переведённых жанров с постерами
const translatedGenresWithPosters = computed(() => {
  return (genresWithPosters.value || []).map(({ genre, posterUrl }) => ({
    genre: translateGenre(genre),
    originalGenre: genre,
    posterUrl
  }));
});

// Загрузка жанров
const loadGenres = async () => {
  try {
    pending.value = true;
    genres.value = await fetchGenres();
  } catch (err) {
    error.value = err as Error;
  } finally {
    pending.value = false;
  }
};

// Загрузка фильмов по оригинальному названию жанра
const loadMovies = async (genre: string) => {
  try {
    pending.value = true;
    selectedGenre.value = genre;
    movies.value = await fetchMoviesByGenre(genre);
  } catch (err) {
    error.value = err as Error;
  } finally {
    pending.value = false;
  }
};

const resetGenre = () => {
  selectedGenre.value = null;
  movies.value = [];
};

loadGenres();

const { data: genresWithPosters } = await useAsyncData(
  'genres-with-posters',
  () => fetchGenresWithPosters()
);

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = fallbackImage;
};
</script>

<template>
  <div class="genres-container">
    <div v-if="!selectedGenre" class="genres-list">
      <h1 class="genres-title">Жанры фильмов</h1>
      
      <div v-if="pending" class="loading-state">
        <div v-for="i in 8" :key="i" class="genre-skeleton"></div>
      </div>

      <div v-else-if="error" class="error-state">
        <p>Не удалось загрузить список жанров</p>
        <button @click="loadGenres" class="retry-button">Попробовать снова</button>
      </div>

      <div v-else class="genres-grid">
        <div 
          v-for="{ genre, originalGenre, posterUrl } in translatedGenresWithPosters" 
          :key="originalGenre"
          class="genre-item"
          @click="loadMovies(originalGenre)"
        >
        <div class="genre-title">{{ genre }}</div>
        <NuxtImg
            :src="posterUrl"
            :alt="`Постер жанра ${genre}`"
            class="genre-image"
            loading="lazy"
            format="webp"
            :modifiers="{ resize: '300x450', quality: 80 }"
            @error="handleImageError"
          />

        </div>
      </div>
    </div>

    <div v-else class="movies-by-genre">
      <div class="genre-header">
        <button @click="resetGenre" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M18.047 20.0012L26.2967 28.2507L23.9397 30.6077L13.333 20.0012L23.9397 9.39453L26.2967 11.7515L18.047 20.0012Z" fill=""/>
          </svg>
        </button>
        <h2 class="genre-title">{{ translateGenre(selectedGenre) }}</h2>
      </div>

      <MovieGrid :movies="movies" :loading="pending" />
    </div>
  </div>
</template>