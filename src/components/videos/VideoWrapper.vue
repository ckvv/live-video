<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue';
import videojs from 'video.js';
import { ref, shallowRef, withDefaults } from 'vue';

withDefaults(defineProps<{
  options?: any
}>(), {
  options: () => {},
});

const modelValue = defineModel();
const player = shallowRef<ReturnType<typeof videojs>>();
const video = ref({ width: 0, height: 0 });
function handleMounted(payload: any) {
  player.value = payload.player;
}

function onLoadedmetadata(payload: any) {
  video.value.height = player.value?.videoHeight() || 0;
  video.value.width = player.value?.videoWidth() || 0;
}
</script>

<template>
  <div class="video-wrapper">
    <div class="bg-white p-y-1">
      <el-button size="small" @click="player?.play()">
        开始
      </el-button>
      <el-button size="small" @click="player?.pause()">
        暂停
      </el-button>
      <el-button size="small" @click="player?.muted(!player?.muted())">
        声音
      </el-button>
      <span class="float-right">{{ options?.name }}</span>
    </div>
    <div class="position-relative w-500px h-400px">
      <VideoPlayer v-bind="options" class="w-full h-full" @mounted="handleMounted" @ready="player?.play()" @loadedmetadata="onLoadedmetadata">
        <VideoTag v-model="modelValue" :video="video" />
      </VideoPlayer>
    </div>
  </div>
</template>
