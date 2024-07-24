<script setup lang="ts">
import { nextTick, ref, shallowRef } from 'vue';
import { Canvas, Control, Rect, Textbox } from 'fabric';

defineProps<{
  video: { width: string, height: string }
}>();

const id = ref(0);
const modelValue = defineModel();
const canvasRef = ref();
const canvas = shallowRef<Canvas>();

const deleteIcon = 'data:image/svg+xml,%3C%3Fxml version=\'1.0\' encoding=\'utf-8\'%3F%3E%3C!DOCTYPE svg PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'%3E%3Csvg version=\'1.1\' id=\'Ebene_1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' width=\'595.275px\' height=\'595.275px\' viewBox=\'200 215 230 470\' xml:space=\'preserve\'%3E%3Ccircle style=\'fill:%23F44336;\' cx=\'299.76\' cy=\'439.067\' r=\'218.516\'/%3E%3Cg%3E%3Crect x=\'267.162\' y=\'307.978\' transform=\'matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)\' style=\'fill:white;\' width=\'65.545\' height=\'262.18\'/%3E%3Crect x=\'266.988\' y=\'308.153\' transform=\'matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)\' style=\'fill:white;\' width=\'65.544\' height=\'262.179\'/%3E%3C/g%3E%3C/svg%3E';
const deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

function formatCanvasJSON(params: any) {
  if (!Array.isArray(params)) {
    return [];
  }
  return params.filter(v => v.type === 'Rect').map((v, index) => {
    const { left, top, width, height } = v;
    return {
      text: params?.[2 * index + 1]?.text,
      left: Math.round(left / 5),
      top: Math.round(top / 3),
      right: Math.round((left + width) / 5),
      bottom: Math.round((top + height) / 3),
      width: Math.round(width / 5),
      height: Math.round(height / 3),
    };
  });
}

nextTick(() => {
  if (!canvasRef.value) {
    return;
  }

  canvas.value = new Canvas(canvasRef.value);
  // canvas.value.setDimensions({
  //   width: props.video.width,
  //   height: props.video.height,
  // });
  // canvas.value.renderAll();

  const getSelectedItems = () => {
    if (!canvas.value) {
      return;
    }
    return canvas.value.getActiveObjects();
  };
  canvas.value.on('after:render', () => {
    if (canvas.value) {
      modelValue.value = formatCanvasJSON(canvas.value.toJSON()?.objects);
    }
  });

  canvas.value.on('mouse:down', (options) => {
    if (!canvas.value) {
      return;
    }
    id.value++;
    const pointer = canvas.value.getScenePoint(options.e);
    const startX = pointer.x;
    const startY = pointer.y;
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
      });
      canvas.value.renderAll();
    };
    // 鼠标移动时更新矩形大小
    canvas.value.on('mouse:move', (options) => {
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
            mouseUpHandler(eventData, transform, x, y) {
              if (canvas.value) {
                canvas.value.remove(transform.target);
                canvas.value.renderAll();
              }
            },
            actionName: 'delete',
            // 自定义渲染
            render(ctx, left, top, styleOverride, fabricObject) {
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
    canvas.value.on('mouse:up', () => {
      if (!canvas.value) {
        return;
      }
      if (rect) {
        textbox = new Textbox('名称', {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          fontSize: 18,
          fill: '#fff',
          backgroundColor: '#0062B18F',
          cornerSize: 6,
          transparentCorners: false,
          hasControls: false,
          lockRotation: true,
          lockMovementX: true,
          lockMovementY: true,
          lockScalingFlip: true,
          editable: true, // 允许编辑
        });

        rect.on('removed', () => {
          if (canvas.value && textbox) {
            canvas.value.remove(textbox);
          }
        });
        canvas.value.add(textbox);
      }
      canvas.value.off('mouse:move');
      canvas.value.off('mouse:up');
    });
  });
});
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <canvas ref="canvasRef" width="500" height="300" class="position-absolute w-full h-full top-0 left-0" />
  </div>
</template>

<style lang="scss">
.canvas-container {
  position: absolute !important;
  z-index: 9;
  // pointer-events: ;
}
</style>
