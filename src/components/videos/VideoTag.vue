<script setup lang="ts">
import { nextTick, shallowRef, ref, watch } from 'vue';
import { Canvas, Rect, Textbox, Control } from 'fabric'
import { deleteImg } from './delete'

const modelValue = defineModel()
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
  canvas.value.on('after:render', () => {
    if(canvas.value) {
      modelValue.value = canvas.value.toJSON()?.objects;
    }
  })

  canvas.value.on('mouse:down', function (options) {
    if (!canvas.value) return;
    const pointer = canvas.value.getScenePoint(options.e);
    let startX = pointer.x;
    let startY = pointer.y;
    let rect: Rect | undefined;
    let textbox: Textbox | undefined;

    const syncTextbox = () => {
      if (!canvas.value || !rect || !textbox) {
        return;
      }
      textbox.set({
        left: rect?.left,
        top: rect?.top,
        width: rect?.width,
      })
      canvas.value.renderAll();
    }
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
      if (distance > 60) {
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

          const deleteControl = new Control({
            // 相对于中心点的偏移量，1指偏移一整个width
            x: 0.6,
            y: -0.7,
            sizeX: 30, // 控件的宽度
            sizeY: 30,
            cursorStyle: 'pointer',
            // 鼠标按下事件
            mouseUpHandler: (eventData, transform, x, y) => {
              canvas.value && canvas.value.remove(transform.target);
              canvas.value && canvas.value.renderAll();
            },
            // 控件名字
            actionName: 'delete',
            // 自定义渲染
            render: (ctx, left, top, styleOverride, fabricObject) => {
              ctx.save();
              ctx.translate(left, top);
              ctx.drawImage(deleteImg, 0, 0, 20, 20);
              ctx.restore();
            },
          });

          rect.controls.delete = deleteControl;

          rect.on('moving', syncTextbox);
          rect.on('modified', syncTextbox);
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
          fontSize: 18,
          fill: '#fff',
          cornerSize: 6,
          transparentCorners: false,
          hasControls: false,
          lockRotation: true,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingFlip: true,
          editable: true // 允许编辑
        });

        rect.on('removed', () => {
          if (canvas.value && textbox) {
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
  <canvas ref="canvasRef" width="500" height="400" class="position-absolute w-full h-full top-0 left-0"></canvas>
</template>

<style lang="scss">
.canvas-container {
  position: absolute !important;
  z-index: 9;
}
</style>
