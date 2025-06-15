<script lang="ts" setup>

import { ref } from 'vue';

const props = defineProps<{
  trailerId: string;
  isOpen: boolean;
  movieTitle?: string;
}>();

const emit = defineEmits(['close']);

const iframeRef = ref<HTMLIFrameElement | null>(null);
const isPaused = ref(false);
const isHovered = ref(false);

const player = ref<any>(null);

const closeModal = () => {
  emit('close');
};

const getEmbedUrl = computed(() => {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    controls: '0',
    showinfo: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    disablekb: '1',
    fs: '0',
    enablejsapi: '1'
  });
  return `https://www.youtube.com/embed/${props.trailerId}?${params.toString()}`;
});
onMounted(() => {
  // Загрузка YouTube API
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  window.onYouTubeIframeAPIReady = () => {
    player.value = new YT.Player(iframeRef.value, {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };
});

const onPlayerReady = (event: any) => {
  // Автовоспроизведение
  event.target.playVideo();
};

const onPlayerStateChange = (event: any) => {
  isPaused.value = event.data !== YT.PlayerState.PLAYING;
};

const togglePlay = () => {
  if (!player.value) return;
  
  if (isPaused.value) {
    player.value.playVideo();
  } else {
    player.value.pauseVideo();
  }
};
</script>

<template>
  <div>
    <div v-if="isOpen" class="trailer-modal">
      <div class="trailer-modal-overlay" @click="closeModal"></div>
      <div class="trailer-modal-content">
        <iframe 
          ref="iframeRef"
          :src="getEmbedUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="trailer-iframe"
          @load="isPaused = false"
        ></iframe>
        
        <!-- Кастомные элементы управления -->
        <!-- <div class="custom-controls" :class="{ 'visible': isHovered || isPaused }">
          <div class="movie-title" v-if="props.movieTitle">
            {{ props.movieTitle }}
          </div>
          <button class="play-pause-btn" @click="togglePlay">
            <svg v-if="isPaused" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <svg v-else viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          </button>
        </div> -->
    </div>

  </div>
</div>
</template>

<style scoped></style>
