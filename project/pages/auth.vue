<script setup lang="ts">
import AuthModal from '~/components/AuthModal.vue';

const showAuthModal = ref(true);

const closeAuthModal = () => {
  showAuthModal.value = false;
};
</script>

<template>
  <div>
    <AuthModal v-if="showAuthModal" @close="closeAuthModal" />
  </div>
</template>

<style scoped>
</style>