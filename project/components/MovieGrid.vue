<script setup lang="ts">
import fallbackImage from '~/assets/img/no-poster.jpg';


defineProps<{
  movies: Movie[]
  showNumbers?: boolean
  showRemove?: boolean
}>()

const emit = defineEmits(['remove'])
</script>

<template>
  <div class="movie-grid">
    <NuxtLink 
      v-for="(movie, index) in movies" 
      :key="movie.id" 
      :to="`/movie/${movie.id}`"
      class="movie-poster"
    >
      <div class="poster-container">
        <!-- Номера для главной -->
        <div v-if="showNumbers" class="top-badge">
          {{ index + 1 }}
        </div>
        
        <!-- Крестик для избранного -->
        <button 
          v-if="showRemove"
          class="remove-btn"
          @click.stop.prevent="emit('remove', movie.id)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path xmlns="http://www.w3.org/2000/svg" d="M11.9987 10.5865L16.9485 5.63672L18.3627 7.05093L13.4129 12.0007L18.3627 16.9504L16.9485 18.3646L11.9987 13.4149L7.04899 18.3646L5.63477 16.9504L10.5845 12.0007L5.63477 7.05093L7.04899 5.63672L11.9987 10.5865Z" fill="black"/>          </svg>
        </button>

        <img
          :src="movie.posterUrl || fallbackImage"
          :alt="movie.title"
          class="poster-image"
        />
      </div>
    </NuxtLink>
  </div>
</template>