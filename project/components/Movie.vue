<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { fetchAddToFavorites, fetchRemoveFromFavorites } from '../composables/fetch';
import fallbackImage from '~/assets/img/no-poster.jpg';
import { useDots } from '~/utils/dotsGenerator'

const { calculateDots } = useDots()
const detailItems = ref<HTMLElement[]>([])



const props = defineProps<{
  movie: Movie | null;
  showDetailsButton?: boolean;
  showReloadButton?: boolean;
  showFullInfo?: boolean;
  pending?: boolean;
  error?: Error | null;
  variant?: 'default' | 'search' | 'details'; // Варианты стилей
}>();

const emit = defineEmits(['reload']);

const authStore = useAuthStore();
const trailerModal = ref({ isOpen: false, trailerId: '' });

// Форматирование данных
const formatRuntime = (minutes: number) => {
  // console.log('formatRuntime');
  const hours = Math.floor(minutes / 60);
  return `${hours}ч ${minutes % 60}м`;
};

const formatRating = (rating?: number) => rating?.toFixed(1) ?? 'N/A';

// Работа с избранным
const isFavorite = (movieId: number) => {
  // console.log('isFavorite');
  return authStore.user.favorites?.some(id => Number(id) === movieId) ?? false;
};
const isCurrentFavorite = computed(() => {
  return authStore.user.favorites?.some(id => Number(id) === props.movie.id) ?? false;
});

const toggleFavorite = async (movieId: number) => {
  // console.log('toggleFavorite');
  try {
    if (!authStore.isAuthenticated) {
      authStore.showAuthModal = true;
      return;
    }

    if (isFavorite(movieId)) {
      await fetchRemoveFromFavorites(movieId);
    } else {
      await fetchAddToFavorites(movieId);
    }
    await authStore.checkAuthState();
  } catch (error) {
    console.error('Ошибка изменения избранного:', error);
  }
};

// Обработчики изображений
const handleImageError = (movie: Movie) => {
  movie.posterUrl = fallbackImage;
};

// Управление трейлером
const openTrailer = (trailerId: string) => {
  trailerModal.value = { isOpen: true, trailerId };
};

const closeTrailer = () => {
  trailerModal.value.isOpen = false;
};

const ratingColor = computed(() => {
  const rating = props.movie.tmdbRating || 0;
  
  if (rating >= 8) return '#FFD700';
  if (rating >= 7 && rating < 8) return '#4CAF50';
  return '#9E9E9E';
});

// Инициализация точек
const initDots = () => {
  nextTick(() => {
    detailItems.value.forEach(container => {
      const labelContainer = container.querySelector('.detail-label-container')
      const label = container.querySelector('.detail-label')
      const value = container.querySelector('.detail-value')
      const dots = container.querySelector('.detail-dots')
      
      if (!labelContainer || !label || !value || !dots) return
      
      const containerWidth = labelContainer.offsetWidth
      const labelWidth = label.offsetWidth
      const valueWidth = value.offsetWidth
      
      dots.textContent = calculateDots(containerWidth, labelWidth, valueWidth)
    })
  })
}
onMounted(() => {
  initDots()
  window.addEventListener('resize', initDots)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', initDots)
})

</script>


<template>
  <div class="movie-card">
    <div v-if="pending" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">
      Ошибка: {{ error.message }}
    </div>
    <section class="movie-content">
      <div class="movie-content-top">
        <div class="movie-about">
          <div class="movie-info">
              <div v-if="movie.tmdbRating"
              class="movie-raiting"
              :style="{ '--raiting-color': ratingColor }">
                    ★ {{ formatRating(movie.tmdbRating) }}
              </div>              
              <span class="movie-release-year"> {{ movie.releaseYear }} </span>
              <span class="movie-genre">  {{ movie.genres.join(', ') }} </span>
              <div class="movie-runtime"> {{ formatRuntime(movie.runtime) }} </div>
          </div>
          <div class="movie-details">
            <div class="movie-title"> {{ movie.title }} </div>
            <div class="movie-descr"> {{ movie.plot  }} </div>
            <div class="movie-buttons">
            <button class="movie-trailer-btn" @click="openTrailer(movie.trailerYouTubeId)">
              Трейлер
            </button>              
            <button v-if="showDetailsButton">
              <NuxtLink 
                :to="`/movie/${movie.id}`"
                class="button-about-card"
                >
                О фильме
              </NuxtLink>
            </button>
            <button class="button-to-favorites" 
              @click="toggleFavorite(movie.id)"
              :class="{ 'active': isFavorite(movie.id) }"
              :aria-pressed="isFavorite(movie.id)"
              :title="isFavorite(movie.id) ? 'Удалить из избранного' : 'Добавить в избранное'"
              >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path 
                  :fill="isCurrentFavorite ? 'currentColor' : 'transparent'"
                  stroke="currentColor"
                  stroke-width="1.5"
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
            <button v-if="showReloadButton" class="button-reload" @click="$emit('reload')">
              <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
              </svg>
            </button>
          </div>
        </div>
        </div>
        <div class="movie-poster">
          <img
          :src="movie.posterUrl || fallbackImage"
          :alt="movie.title"
          class="poster-image"
          loading="lazy"
          format="webp"
          :modifiers="{ 
            resize: '224x336',
            quality: 80 
          }"
          @error="handleImageError(movie)"
          />
        </div>
      <Teleport to="body">
        <Trailer 
          v-if="trailerModal.isOpen"
          :isOpen="trailerModal.isOpen"
          :trailerId="trailerModal.trailerId"
          :movieTitle="movie?.title"
          @close="closeTrailer"
        />
      </Teleport>  
      </div>
      <div v-if="showFullInfo" class="movie-more-details">
        <div class="more-details-h1">О фильме</div>
        <div class="detail-items">
          <!-- Язык оригинала -->
          <div class="detail-item" ref="el => detailItems[0] = el">
            <div class="detail-label-container">
              <span class="detail-label">Язык оригинала:</span>
              <span class="detail-dots"></span>
            </div>
            <span class="detail-value">{{ movie.language }}</span>
          </div>

          <!-- Бюджет -->
          <div 
            v-if="movie.budget" 
            class="detail-item" 
            ref="el => detailItems[1] = el"
          >
            <div class="detail-label-container">
              <span class="detail-label">Бюджет:</span>
              <span class="detail-dots"></span>
            </div>
            <span class="detail-value">{{ movie.budget.toLocaleString() }}</span>
          </div>

          <!-- Выручка -->
          <div class="detail-item" ref="el => detailItems[2] = el">
            <div class="detail-label-container">
              <span class="detail-label">Выручка:</span>
              <span class="detail-dots"></span>
            </div>
            <span class="detail-value">{{ movie.awardsSummary || 'N/A' }}</span>
          </div>

          <!-- Продакшн -->
          <div class="detail-item" ref="el => detailItems[3] = el">
            <div class="detail-label-container">
              <span class="detail-label">Продакшн:</span>
              <span class="detail-dots"></span>
            </div>
            <span class="detail-value">{{ movie.production || 'N/A' }}</span>
          </div>

          <!-- Режиссер -->
          <div class="detail-item" ref="el => detailItems[4] = el">
            <div class="detail-label-container">
              <span class="detail-label">Режиссер:</span>
              <span class="detail-dots"></span>
            </div>
            <span class="detail-value">{{ movie.director || 'N/A' }}</span>
          </div>

          <!-- Награды -->
          <div class="detail-item" ref="el => detailItems[5] = el">
            <div class="detail-label-container">
              <span class="detail-label">Награды:</span>
              <span class="detail-dots"></span>
            </div>
            <span class="detail-value">{{ movie.cast || 'N/A' }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
  .movie-raiting {
    width: 70px;
    height: 28px;
    padding-top: 4px;
    text-align: center;
    background-color: var(--raiting-color);
    border-radius: 16px;
    line-height: 24px;
    font-weight: bold;
    font-size: 18px;
  }

</style>