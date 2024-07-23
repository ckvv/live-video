<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue';

defineProps<{
  options: any
}>();

const modelValue = defineModel();
</script>

<template>
  <div class="live-video">
    <div class="bg-white p-y-1">
      <el-button>开始</el-button>
      <el-button>暂停</el-button>
    </div>
    <div class="video-player position-relative w-500px h-400px">
      <VideoPlayer v-bind="options" class="w-full h-full">
        <VideoTag v-model="modelValue" />
      </VideoPlayer>
    </div>
  </div>
</template>
