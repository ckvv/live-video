<script setup lang="ts">
import { nextTick, shallowRef, ref, watch } from 'vue';
import { VideoPlayer } from '@videojs-player/vue'
import { Canvas, Rect, Textbox } from 'fabric'

defineProps<{
  options: any
}>()

const canvasRef = ref();
const canvas = shallowRef<Canvas>()

nextTick(() => {
  if (!canvasRef.value) return;

  canvas.value = new Canvas(canvasRef.value);

  const getSelectedItems = () => {
    if (!canvas.value) return;
    return canvas.value.getActiveObjects();
  }
  canvas.value.on('mouse:down', function (options) {
    if (!canvas.value) return;
    const pointer = canvas.value.getScenePoint(options.e);
    let startX = pointer.x;
    let startY = pointer.y;
    let rect: Rect | undefined;
    let textbox: Textbox | undefined;

    // 鼠标移动时更新矩形大小
    canvas.value.on('mouse:move', function (options) {
      if (!canvas.value || !startX || !startY || getSelectedItems()?.length) {
        return;
      }
      const pointer = canvas.value.getScenePoint(options.e);
      const width = Math.abs(pointer.x - startX);
      const height = Math.abs(pointer.y - startY);
      const distance = Math.sqrt(width * width + height * height);
      // 避免用户误触时创建太小的矩形
      if (distance > 20) {
        if (!rect) {
          rect = new Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: 'transparent',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: true,
          });

          rect.on('modified', () => {
            if(canvas.value && textbox) {
              textbox.set({
                left: rect?.left,
                top: rect?.top,
                width: rect?.width,
              })
              canvas.value.renderAll();
            }
          })
          canvas.value.add(rect);
        } else {
          rect.set({ width, height });
        }
      }
      canvas.value.renderAll();
    });

    // 鼠标释放时停止绘制
    canvas.value.on('mouse:up', function () {
      if (!canvas.value) return;
      if (rect) {
        textbox = new Textbox('名称', {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          fontSize: 16,
          fill: '#fff',
          cornerSize: 6,
          transparentCorners: false,
          editable: true // 允许编辑
        });

        rect.on('removed', () => {
          if(canvas.value && textbox ) {
            canvas.value && canvas.value.remove(textbox)
          }
        })
        canvas.value.add(textbox);
      }
      canvas.value.off('mouse:move');
      canvas.value.off('mouse:up');
    });
  });
});
</script>

<template>
  <div class="">
    <div class="bg-white p-y-1">
      <el-button>开始</el-button>
      <el-button>暂停</el-button>
    </div>
    <div class="video-player position-relative w-500px h-400px">
      <canvas ref="canvasRef" width="500" height="400" class="position-absolute w-full h-full top-0 left-0"></canvas>
      <video-player v-bind="options" class="w-full h-full"></video-player>
    </div>
  </div>
</template>

<style lang="scss">
.canvas-container {
  position: absolute !important;
  z-index: 9;
}
</style>
