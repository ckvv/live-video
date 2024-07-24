<script setup lang="ts">
defineProps<{
  info: any
}>();

const modelValue = defineModel();
</script>

<template>
  <el-drawer v-model="modelValue" title="标注信息" class="min-w-500px! max-w-100vw">
    <pre>{{ info }}</pre>
  </el-drawer>
</template>
