<script setup lang="ts">
const route = useRoute();

const { data: movie, pending, error} = await useAsyncData(`movie-${route.params.id}`, () => 
  fetchMovieDetails(Number(route.params.id))
)
</script>

<template>
  <div class="movie-page">
    <Movie 
      :movie="movie"
      :show-details-button="false"
      :show-reload-button="false"
      :show-full-info="true"
    />
  </div>
</template>