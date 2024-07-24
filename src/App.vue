<script setup lang="ts">
import { computed, ref } from 'vue';
import { IPTVS } from '@/constant/iptvs';

const defaultOptions = {
  autoplay: true,
  muted: true, // https://developer.chrome.com/blog/autoplay?hl=zh-cn
  controls: true,
  controlBar: {
    pictureInPictureToggle: false,
    fullscreenToggle: false,
  },
};
const videoList = ref<any>(IPTVS.slice(0, 6).map(v => ({ options: { ...v, ...defaultOptions } })));

const dialogVisible = ref(false);
const drawerVisible = ref(false);

function addVideo(options: any) {
  videoList.value.push({
    options: {
      ...defaultOptions,
      ...options,
    },
  });
}

const formatVideoList = computed((v) => {
  return videoList.value.map((video: any) => {
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
  <VideoList :data="videoList" />
  <VideoInfo v-model="drawerVisible" :info="formatVideoList" />
  <VideoDialog v-model="dialogVisible" @confirm="addVideo" />
</template>
