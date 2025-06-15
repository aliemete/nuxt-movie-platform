<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from '#app'
import { ref, watch, onMounted } from 'vue'
import { fetchMovies } from '../composables/fetch';
import fallbackImage from '~/assets/img/no-poster.jpg';


const authStore = useAuthStore()
const router = useRouter()
const { isAuthenticated, user, showAuthModal } = storeToRefs(authStore)
const authCheckPending = ref(true);

// Состояния для адаптива
const isNavOpen = ref(false)
const isSearchExpanded = ref(false)

// навигация
const navigationLinks = [
  { name: 'Главная', path: '/', exact: true },
  { name: 'Жанры', path: '/genres' }
]
const handleAccountNavigation = async () => {
  console.log('handleAccountNavigation');
  try {
    console.log('Текущее состояние isAuthenticated:', isAuthenticated.value);
    if (isAuthenticated.value) {
      await router.push('/account')
    } else {
      console.log('isAuthenticated.value');
      authStore.showAuthModal = true
      console.log(authStore.showAuthModal);
    }
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

// Поиск
const searchQuery = ref('')
const searchResults = ref<Movie[]>([])
const isSearchActive = ref(false)
let timeoutId: number | null = null
const searchContainerRef = ref<HTMLElement | null>(null)

const handleSearchClickOutside = (event: MouseEvent) => {
  console.log('handleSearchClickOutside');
  console.log(searchContainerRef.value);
  if (searchContainerRef.value && !searchContainerRef.value.contains(event.target as Node)) {
    isSearchActive.value = false;
  }
}
// Закрытие меню при клике вне области
const closeMenus = (e: MouseEvent) => {
  if (!e.target.closest('.burger-menu') && !e.target.closest('.mobile-navigation')) {
    isNavOpen.value = false
  }
  if (!e.target.closest('.search-wrapper')) {
    isSearchExpanded.value = false
  }
}


const searchHandler = () => {
  if (typeof window === 'undefined') return

  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = window.setTimeout(async () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = []
      return
    }

    try {
      const data = await fetchMovies({
        title: searchQuery.value,
        count: 5
      })
      searchResults.value = Array.isArray(data) ? data.slice(0, 5) : []
      isSearchActive.value = true
    } catch (error) {
      console.error('Search error:', error)
      searchResults.value = []
    }
  }, 300)
}
// Наблюдаем за изменениями поискового запроса
watch(searchQuery, () => {
  if (typeof window !== 'undefined') {
    searchHandler()
  }
})
watch(isSearchActive, (newVal) => {
  if (newVal) {
    document.addEventListener('mousedown', handleSearchClickOutside);
  } else {
    document.removeEventListener('mousedown', handleSearchClickOutside);
  }
});
const handleResultClick = async (movieId: number) => {
  if (!movieId) return
  
  try {
    await router.push(`/movie/${movieId}`)
  } catch (error) {
    console.error('Navigation error:', error)
  } finally {
    clearSearch()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  isSearchActive.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

// обработка результатов для вывода информации о рандомном фильме
const formatRuntime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  return `${hours}ч ${minutes % 60}м`
}

// проверка статуса авторизации
onMounted(async () => {
  // console.log('onMounted Header');
  await authStore.checkAuthState();
  authCheckPending.value = false;
  console.log('Клиентская проверка кук:', document.cookie);
  window.addEventListener('click', closeMenus)
});

// закрытие поиска
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleSearchClickOutside);
  window.removeEventListener('click', closeMenus)
});


</script>

<template>
  <header class="header">
    <NuxtLink 
      to="/" 
    >
      <div class="logo-wrapper">
        <img
          src="~/assets/img/logo.png"
          alt="Логотип"
          class="logo-image"
        />
        <img
          src="~/assets/img/маруся.png"
          alt="Название сервиса"
          class="logo-text"
        />
      </div>
    </NuxtLink>

  <!-- Бургер-меню -->
  <button class="burger-menu" @click.stop="isNavOpen = !isNavOpen">
<svg v-if="!isNavOpen" width="24" height="24" viewBox="0 0 24 24">
  <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
</svg>
<svg v-else width="24" height="24" viewBox="0 0 24 24">
  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
</svg>
</button>

<!-- Мобильная навигация  -->
<nav class="mobile-navigation" :class="{ 'active': isNavOpen }">
  <NuxtLink
    v-for="link in navigationLinks"
    :key="link.path"
    :to="link.path"
    class="nav-link"
    @click="isNavOpen = false"
  >
    {{ link.name }}
  </NuxtLink>
</nav>


<!-- Мобильный поиск  -->
<div class="search-wrapper">
  <button class="search-icon-mobile" @click.stop="isSearchExpanded = !isSearchExpanded">
    <svg width="24" height="24" viewBox="0 0 24 24"><!-- ... --></svg>
  </button>
  <div class="search-container mobile-search" :class="{ 'expanded': isSearchExpanded }">
    <!-- ... -->
  </div>
</div>

    <nav class="navigation">
      <NuxtLink
        v-for="link in navigationLinks"
        :key="link.path"
        :to="link.path"
        class="nav-link"
        :exact="link.exact"
        active-class="active-link"
      >
        {{ link.name }}
      </NuxtLink>
      <div class="search-container" ref="searchContainerRef">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="25" height="25" viewBox="0 0 24 24">
          <path xmlns="http://www.w3.org/2000/svg" d="M18.3591 16.6168L22.6418 20.8995L21.2276 22.3137L16.9449 18.031C15.405 19.263 13.4521 20 11.3281 20C6.36013 20 2.32812 15.968 2.32812 11C2.32812 6.032 6.36013 2 11.3281 2C16.2961 2 20.3281 6.032 20.3281 11C20.3281 13.124 19.5911 15.0769 18.3591 16.6168ZM16.3528 15.8748C17.5756 14.6146 18.3281 12.8956 18.3281 11C18.3281 7.1325 15.1956 4 11.3281 4C7.46062 4 4.32812 7.1325 4.32812 11C4.32812 14.8675 7.46062 18 11.3281 18C13.2237 18 14.9427 17.2475 16.2029 16.0247L16.3528 15.8748Z" fill=""/>
        </svg>
        
        <input
          v-model="searchQuery"
          class="search-input"
          placeholder="Поиск"
          @focus="isSearchActive = true"
        >
        
        <button
          v-if="searchQuery"
          class="clear-button"
          @click="clearSearch"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
        <div v-if="isSearchActive && searchResults.length" class="search-results" @mousedown.prevent>
          <div 
            v-for="movie in searchResults"
            :key="movie.id"
            class="search-result-item"
            @click="handleResultClick(movie.id)"
          >
              <div class="search-movies">
                <div class="search-movie-poster">
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
                  />
                </div>
                <div class="search-movie-info">
                  <div class="search-movie-meta">
                    <span v-if="movie.tmdbRating" class="search-movie-raiting">
                      ★ {{ movie.tmdbRating.toFixed(1) }}
                    </span>
                    <span class="search-movie-release-year">{{ movie.releaseYear }}</span>
                    <span class="search-movie-genre">{{ movie.genres.join(', ') }}</span>
                    <div class="search-movie-runtime">{{ formatRuntime(movie.runtime) }}</div>
                  </div>
                  <div class="search-movie-title">
                    {{ movie.title }}
                  </div>
                </div>
              </div>
          </div>
        </div>
    </div>
    </nav>

    <div class="auth-section">
      <button
        class="auth-button"
        @click="handleAccountNavigation"
        :class="{ 'authenticated': isAuthenticated }"
      >
        <span v-if="isAuthenticated">
          {{ user.name || user.email }}
        </span>
        <span v-else >
          Войти
        </span>
      </button>
    </div>
  </header>

</template>