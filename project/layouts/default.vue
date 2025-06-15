<template>
  <div class="layout">
    <Header />
    <slot />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue';
import { useAuthStore } from '~/stores/auth';
import { useRoute } from '#app';
import { watch, onMounted } from 'vue';

const authStore = useAuthStore();
const route = useRoute();

// Отслеживаем изменения маршрута
watch(
  () => route.path,
  async (newPath, oldPath) => {
    // Пропускаем проверку для внутренних переходов в аккаунте
    if (newPath.startsWith('/account') && oldPath?.startsWith('/account')) return;
    
    try {
      await authStore.checkAuthState();
      console.log('Auth state checked after route change');
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  },
  { immediate: true }
);

// Первоначальная проверка при монтировании
onMounted(async () => {
  try {
    await authStore.checkAuthState();
    console.log('Initial auth check completed');
  } catch (error) {
    console.error('Initial auth check failed:', error);
  }
});
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1 0 auto; 
  padding: 20px 0; 
}

Footer {
  flex-shrink: 0; 
}
</style>