<script setup lang="ts">
import { ref } from 'vue';
import MovieGrid from '~/components/MovieGrid.vue';

const { data: topMovies } = await useAsyncData('topMovies', () => fetchTopMovies());
const randomMovie = ref(await fetchRandomMovie());

const refreshRandomMovie = async () => {
  randomMovie.value = await fetchRandomMovie();
};

</script>


<template>
  <div class="main-content">
    <main>
      <div class="content-block">
          <section v-if="randomMovie">
            <Movie 
              :movie="randomMovie"
              :show-details-button="true"
              :show-reload-button="true"
              :show-full-info="false"
              @reload="refreshRandomMovie"
            />
          </section>
          <section v-else>
              <!-- Скелетон для randomMovie -->
              <div class="skeleton-random-movie">
              <!-- Левая часть - постер -->
              <div class="skeleton-poster">
                <SkeletonLoader 
                  width="100%"
                  height="100%"
                  class="poster-image"
                />
              </div>

              <!-- Правая часть - контент -->
              <div class="skeleton-details">
                <SkeletonLoader width="70%" height="40px" />
                <SkeletonLoader width="90%" height="24px" style="margin-top: 24px" />
                <SkeletonLoader width="80%" height="24px" style="margin-top: 16px" />
                
                <!-- Блок мета-данных -->
                <div class="skeleton-meta">
                  <SkeletonLoader width="120px" height="28px" />
                  <SkeletonLoader width="100px" height="28px" style="margin-left: 16px" />
                </div>

                <!-- Блок кнопок -->
                <div class="skeleton-actions">
                  <SkeletonLoader width="160px" height="56px" />
                  <SkeletonLoader width="56px" height="56px" style="margin-left: 16px" />
                </div>
              </div>
            </div>
          </section>

        <section class="top-movies">
          <h2>ТОП 10 фильмов</h2>
            <MovieGrid 
            v-if="topMovies"
            :movies="topMovies"
            show-numbers/>
            <div v-else class="skeleton-grid">
              <!-- <div 
                v-for="i in 10" 
                :key="i" 
                class="skeleton-item"
                :style="{ width: '224px', height: '336px' }"
              >
              </div> -->
            </div>
        </section>
      </div>
    </main>

  </div>
</template>