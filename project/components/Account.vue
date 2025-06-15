<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { fetchMovieDetails } from '../composables/fetch';

const authStore = useAuthStore();
const activeTab = ref<'favorites' | 'settings'>('favorites');
const favorites = ref<Movie[]>([]);
const pending = ref(false);
const error = ref<Error | null>(null);

const { isAuthenticated, user } = storeToRefs(authStore)

// Единая точка управления состоянием
const updateFavoritesState = (newFavorites: string[]) => {
  authStore.user.favorites = newFavorites;
  favorites.value = favorites.value.filter(m => 
    newFavorites.includes(String(m.id))
  );
};

// Загрузка избранного с кешированием
const loadFavorites = async () => {
  try {
    if (!authStore.isAuthenticated || !authStore.user.favorites?.length) {
      favorites.value = [];
      return;
    }

    pending.value = true;
    error.value = null;

    // Загружаем только недостающие фильмы
    const existingIds = new Set(favorites.value.map(m => m.id));
    const idsToFetch = authStore.user.favorites
      .filter(id => !existingIds.has(Number(id)))
      .map(Number);

    if (idsToFetch.length === 0) return;

    const newMovies = await Promise.all(
      idsToFetch.map(id => fetchMovieDetails(id))
    );

    favorites.value = [
      ...favorites.value,
      ...newMovies.filter(m => m !== null) as Movie[]
    ];
  } catch (err) {
    error.value = err as Error;
    console.error('Ошибка загрузки избранного:', err);
  } finally {
    pending.value = false;
  }
};

// Удаление с оптимизированным обновлением
const handleRemoveFromFavorites = async (movieId: number) => {
  try {
    const initialFavorites = [...(authStore.user.favorites || [])];
    
    // Оптимистичное обновление
    const updatedFavorites = initialFavorites.filter(id => Number(id) !== movieId);
    updateFavoritesState(updatedFavorites);

    await fetchRemoveFromFavorites(movieId);
    
    // Синхронизация после успешного удаления
    authStore.user.favorites = updatedFavorites;
  } catch (err) {
    // Откат при ошибке
    updateFavoritesState(initialFavorites);
    error.value = new Error('Не удалось удалить фильм из избранного');
  }
};

//Выход из аккаунта
const handleLogout = async () => {
  await authStore.logout();
};

// Загрузка при монтировании и при изменении favorites в хранилище
watch(
  () => authStore.user.favorites,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      loadFavorites();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="account-component">
    <h2>Мой аккаунт</h2>
    
    <div class="account-menu">
      <button
        class="account-menu-link"
        :class="{ 'active-link': activeTab === 'favorites' }"
        @click="activeTab = 'favorites'"
        role="button"
        tabindex="0"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="white"/>
      </svg>
        Избранное
      </button>      
      <button
        class="account-menu-link"
        :class="{ 'active-link': activeTab === 'settings' }"
        @click="activeTab = 'settings'"
        role="button"
        tabindex="0"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3ZM12.9339 18.6038C13.8155 18.0485 14.61 17.4955 15.3549 16.9029C18.3337 14.533 20 11.9435 20 9C20 6.64076 18.463 5 16.5 5C15.4241 5 14.2593 5.56911 13.4142 6.41421L12 7.82843L10.5858 6.41421C9.74068 5.56911 8.5759 5 7.5 5C5.55906 5 4 6.6565 4 9C4 11.9435 5.66627 14.533 8.64514 16.9029C9.39 17.4955 10.1845 18.0485 11.0661 18.6038C11.3646 18.7919 11.6611 18.9729 12 19.1752C12.3389 18.9729 12.6354 18.7919 12.9339 18.6038Z" fill="white"/>
      </svg>
        Настройки
      </button>
    </div>

    <div class="account-content">
      <div v-if="activeTab === 'favorites'">
        <div v-if="pending" class="skeleton-grid">
          <div 
            v-for="i in 5" 
            :key="i" 
            class="skeleton-item"
            :style="{ width: '224px', height: '336px' }"
          ></div>
        </div>

        <div v-else-if="error" class="error-message">
          Ошибка: {{ error.message }}
          <button @click="loadFavorites">Повторить</button>
        </div>

        <div v-else-if="!favorites.length" class="empty-message">
          Нет избранных фильмов
        </div>

        <MovieGrid 
          v-else 
          :movies="favorites" 
          show-remove 
          @remove="handleRemoveFromFavorites"
        />
      </div>

      <div v-if="activeTab === 'settings'">
        <div class="account-details" :class="{ 'authenticated': isAuthenticated }">
          <div class="account-authen" v-if="isAuthenticated">
            <div class="user-name">
              <div class="user-info-img">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <rect width="60" height="60" rx="30" fill="white" fill-opacity="0.5"/>
                  <path d="M15.68 23.424H19.424V29.568C20.128 29.568 20.696 29.44 21.128 29.184C21.56 28.912 22.032 28.4 22.544 27.648L25.472 23.424H29.672L26.312 28.104C25.8 28.824 25.328 29.376 24.896 29.76C24.48 30.128 23.96 30.432 23.336 30.672V30.72C24.136 30.912 24.8 31.256 25.328 31.752C25.872 32.248 26.4 32.968 26.912 33.912L29.672 39H25.472L22.928 34.416C22.592 33.808 22.264 33.352 21.944 33.048C21.64 32.728 21.296 32.512 20.912 32.4C20.528 32.288 20.032 32.232 19.424 32.232V39H15.68V23.424ZM31.4066 23.424H35.1506V29.568C35.8546 29.568 36.4226 29.44 36.8546 29.184C37.2866 28.912 37.7586 28.4 38.2706 27.648L41.1986 23.424H45.3986L42.0386 28.104C41.5266 28.824 41.0546 29.376 40.6226 29.76C40.2066 30.128 39.6866 30.432 39.0626 30.672V30.72C39.8626 30.912 40.5266 31.256 41.0546 31.752C41.5986 32.248 42.1266 32.968 42.6386 33.912L45.3986 39H41.1986L38.6546 34.416C38.3186 33.808 37.9906 33.352 37.6706 33.048C37.3666 32.728 37.0226 32.512 36.6386 32.4C36.2546 32.288 35.7586 32.232 35.1506 32.232V39H31.4066V23.424Z" fill="white"/>
                </svg>
              </div>
                <div class="user-info-span">
                  <span> Имя Фамилия </span>
                  <span class="user-info">
                    {{ user.name || user.surname }}
                  </span>
                </div>
            </div>
            <div class="user-mail">
              <div class="user-mail-img">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <rect width="60" height="60" rx="30" fill="white" fill-opacity="0.5"/>
                  <path d="M39 21C39.5523 21 40 21.4477 40 22V38.0066C40 38.5552 39.5447 39 39.0082 39H20.9918C20.4441 39 20 38.5551 20 38.0066V37H38V25.3L30 32.5L20 23.5V22C20 21.4477 20.4477 21 21 21H39ZM26 33V35H18V33H26ZM23 28V30H18V28H23ZM37.5659 23H22.4341L30 29.8093L37.5659 23Z" fill="white"/>
                 </svg>
              </div>
              <div class="user-mail-span">
                <span> Электронная почта </span>
                <span class="user-info">
                  {{ user.email }}
                </span>
              </div> 
            </div>
            <button class="logout-button" @click="handleLogout">Выйти из аккаунта</button>
          </div>
            <div v-else>
              Авторизуйтесь пожалуйста
            </div>
          </div>
      </div>
    </div>
  </div>
</template>