<script setup lang="ts">
import videojs from 'video.js';
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';

const props = defineProps<{
  options: any
}>();
const player = shallowRef();
const videoPlayerRef = ref();

onMounted(() => {
  player.value = videojs(videoPlayerRef.value, props.options, () => {
    player.value.log('onPlayerReady');
  });
});

onUnmounted(() => {
  player.value?.dispose();
});
</script>

<template>
  <div class="w-full h-full">
    <video ref="videoPlayerRef" v-bind="options" class="video-js w-full h-full" />
  </div>
</template>
