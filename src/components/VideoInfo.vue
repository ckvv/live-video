<script setup lang="ts">
defineProps<{
  info: any
}>();

const modelValue = defineModel();

function download(data: any) {
  const jsonString = JSON.stringify(data);

  const blob = new Blob([jsonString], { type: 'application/json' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json'; // 下载的文件名

  a.click();

  URL.revokeObjectURL(url);
}
</script>

<template>
  <el-drawer v-model="modelValue" title="标注信息" class="min-w-400px! max-w-100vw">
    <pre class="w-full max-h-70vh overflow-auto m-y">{{ info }}</pre>
    <el-button class="w-full" @click="download(info)">
      导出JSON文件
    </el-button>
  </el-drawer>
</template>
