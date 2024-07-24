<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import type { Canvas } from 'fabric';
import { formatCanvasJSON, getVideoCanvas } from '@/utils/videoTag';

const props = defineProps<{
  video: { width: number, height: number }
}>();

const modelValue = defineModel();
const canvasRef = ref();
const canvas = shallowRef<Canvas>();

onMounted(() => {
  if (!canvasRef.value) {
    return;
  }
  canvas.value = getVideoCanvas(canvasRef.value);

  // canvas 绘制后同步绘制数据
  canvas.value.on('after:render', () => {
    if (canvas.value) {
      modelValue.value = formatCanvasJSON(canvas.value.toJSON()?.objects, { width: 5, height: 3 });
    }
  });
});
onUnmounted(() => {
  canvas.value?.destroy();
});

// 适配不同分辨率视频，自适应调整 canvan 大小巧好覆盖视频内容
watch(() => props.video, (value) => {
  if (value) {
    const { width, height } = value;
    const maxWidth = Math.min(window.innerWidth, 500);
    canvas.value?.setDimensions({
      width: maxWidth,
      height: height * maxWidth / width,
    });
  }
}, {
  deep: true,
  immediate: true,
});
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <canvas ref="canvasRef" width="400" height="300" class="position-absolute w-full h-full top-0 left-0" />
  </div>
</template>

<style lang="scss">
.canvas-container {
  position: absolute !important;
  z-index: 1;
  // pointer-events: none;
}
</style>
