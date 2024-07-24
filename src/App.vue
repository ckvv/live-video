<script setup lang="ts">
import { provide, ref } from 'vue';
import { IPTVS } from '@/constant/iptvs';
import { defaultOptions } from '@/constant/videos';

const videoList = ref<any>(IPTVS.slice(0, 6).map(v => ({ options: { ...v, ...defaultOptions } })));

provide('videos', {
  data: videoList,
  add(options: any) {
    videoList.value.push({
      options: {
        ...defaultOptions,
        ...options,
      },
    });
  },
});
</script>

<template>
  <VideoOperate />
  <VideoList :data="videoList" />
</template>
