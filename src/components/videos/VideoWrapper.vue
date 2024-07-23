<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue';
import videojs from 'video.js';
import { shallowRef } from 'vue';

defineProps<{
  options: any
}>();

const modelValue = defineModel();
const player = shallowRef<ReturnType<typeof videojs>>();

function handleMounted(payload: any) {
  player.value = payload.player;
}
</script>

<template>
  <div class="live-video">
    <div class="bg-white p-y-1">
      <el-button @click="player?.play()">
        开始
      </el-button>
      <el-button @click="player?.pause()">
        暂停
      </el-button>
    </div>
    <div class="video-player position-relative w-500px h-400px">
      <VideoPlayer v-bind="options" class="w-full h-full" @mounted="handleMounted" @ready="player?.play()">
        <!-- <VideoTag v-model="modelValue" /> -->
      </VideoPlayer>
    </div>
  </div>
</template>
