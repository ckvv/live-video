<script setup lang="ts">
import { ref } from 'vue';
// import { defaultVideos } from '@/constant/videos';
import { IPTVS } from '@/constant/iptvs';

const defaultOptions = {
  autoplay: true,
  muted: true, // https://developer.chrome.com/blog/autoplay?hl=zh-cn
  controls: false,
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

function exportJSON() {
  drawerVisible.value = true;
}
</script>

<template>
  <div class="text-center p-y-4 position-sticky top-0 z-9 bg-white">
    <el-button type="primary" @click="dialogVisible = true">
      添加视频
    </el-button>
    <el-button type="primary" @click="exportJSON">
      保存
    </el-button>
  </div>
  <div class="w-full flex flex-wrap gap-24px justify-center items-center">
    <VideoWrapper v-for="(item, key) in videoList" :key="key" v-model="item.objects" :options="item.options" />
    <i v-for="i in 4" :key="i" class="w-500px h-0px" />
  </div>
  <el-drawer v-model="drawerVisible" title="标注信息" class="min-w-400px! max-w-100vw">
    <pre>{{ videoList }}</pre>
  </el-drawer>
  <VideoDialog v-model="dialogVisible" @confirm="addVideo" />
</template>
