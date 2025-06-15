<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  try {
    await authStore.checkAuthState();
  } catch (error) {
    console.error('Initialization error:', error);
  }
});

console.log('Инициализация завершена. Статус:', authStore.isAuthenticated);

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
    <AuthModal v-if="authStore.showAuthModal" />
  </NuxtLayout>

</template>