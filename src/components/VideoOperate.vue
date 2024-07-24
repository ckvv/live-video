<script setup lang="ts">
import { computed, inject, ref, toValue } from 'vue';

const videos = inject<any>('videos');

const dialogVisible = ref(false);
const drawerVisible = ref(false);

function addVideo(options: any) {
  videos.add(options);
}

const formatVideoList = computed((v) => {
  return toValue(videos.data).map((video: any) => {
    return {
      src: video.options?.src,
      name: video.options?.name,
      objects: video?.objects,
    };
  });
});
</script>

<template>
  <div class="text-center p-y-4 position-sticky top-0 z-9 bg-white">
    <el-button type="primary" @click="dialogVisible = true">
      添加视频
    </el-button>
    <el-button type="primary" @click="drawerVisible = true">
      保存
    </el-button>
  </div>
  <VideoInfo v-model="drawerVisible" :info="formatVideoList" />
  <VideoDialog v-model="dialogVisible" @confirm="addVideo" />
</template>
