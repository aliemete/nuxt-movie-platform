<script setup lang="ts">
import Header from '~/components/Header.vue';
</script>

<template>
  <div class="layout">
    <Header />
    <slot />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>