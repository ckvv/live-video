<script setup lang="ts">
import { ref } from 'vue';

const videoList = ref<any>(Array.from({ length: 2 }).map(v => ({ options: { src: '//vjs.zencdn.net/v/oceans.mp4', controls: true, autoplay: true } })));

const dialogVisible = ref(false);
const drawerVisible = ref(false);

function addVideo(options: any) {
  videoList.value.push({
    options: {
      ...options,
      controls: true,
      autoplay: true,
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
    <LiveVideo v-for="(item, key) in videoList" :key="key" v-model="item.objects" :options="item.options" />
    <i v-for="i in 4" :key="i" class="w-500px h-0px" />
  </div>
  <el-drawer v-model="drawerVisible" title="标注信息">
    <pre>{{ videoList }}</pre>
  </el-drawer>
  <VideoDialog v-model:dialogVisible="dialogVisible" @confirm="addVideo" />
</template>
