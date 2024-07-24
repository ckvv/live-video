<script setup lang="ts">
withDefaults(defineProps<{
  data?: any[]
}>(), {
  data: () => [],
});
</script>

<template>
  <div class="w-full flex flex-wrap gap-24px justify-center items-center">
    <VideoItem v-for="(item, key) in data" :key="key" v-model="item.objects" :options="item.options" />
    <i v-for="i in 4" :key="i" class="w-500px h-0px" />
  </div>
</template>
