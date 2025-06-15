<template>
  <div class="skeleton-loader" :style="{ width, height }">
    <div class="shimmer"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' }
});
</script>

<style scoped>
.skeleton-loader {
  background: #e1e1e1;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 25%,
    rgba(255,255,255,0.2) 50%,
    rgba(255,255,255,0) 75%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>