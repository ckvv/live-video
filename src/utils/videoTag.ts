import { Canvas, Control, Rect, Textbox } from 'fabric';

const deleteIcon = 'data:image/svg+xml,%3C%3Fxml version=\'1.0\' encoding=\'utf-8\'%3F%3E%3C!DOCTYPE svg PUBLIC \'-//W3C//DTD SVG 1.1//EN\' \'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\'%3E%3Csvg version=\'1.1\' id=\'Ebene_1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' width=\'595.275px\' height=\'595.275px\' viewBox=\'200 215 230 470\' xml:space=\'preserve\'%3E%3Ccircle style=\'fill:%23F44336;\' cx=\'299.76\' cy=\'439.067\' r=\'218.516\'/%3E%3Cg%3E%3Crect x=\'267.162\' y=\'307.978\' transform=\'matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)\' style=\'fill:white;\' width=\'65.545\' height=\'262.18\'/%3E%3Crect x=\'266.988\' y=\'308.153\' transform=\'matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)\' style=\'fill:white;\' width=\'65.544\' height=\'262.179\'/%3E%3C/g%3E%3C/svg%3E';
const deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

export function formatCanvasJSON(params: any, options: { width: number, height: number }) {
  if (!Array.isArray(params)) {
    return [];
  }

  const _width = options.width / 100;
  const _height = options.height / 100;

  return params.filter(v => v.type === 'Rect').map((v, index) => {
    const { left, top } = v;

    // https://stackoverflow.com/questions/40933585/on-object-scaling-the-width-and-height-of-rectangle-dont-change-in-fabric-js
    const width = v.width * v.scaleX;
    const height = v.height * v.scaleY;
    return {
      text: params?.[2 * index + 1]?.text,
      left: Math.round(left / _width),
      top: Math.round(top / _height),
      right: Math.round((left + width) / _width),
      bottom: Math.round((top + height) / _height),
      width: Math.round(width / _width),
      height: Math.round(height / _height),
    };
  });
}

export function getVideoCanvas(el: any) {
  const canvas: Canvas = new Canvas(el);

  const getSelectedItems = () => {
    if (!canvas) {
      return;
    }
    return canvas.getActiveObjects();
  };

  canvas.on('mouse:down', (options) => {
    if (!canvas) {
      return;
    }
    const pointer = canvas.getScenePoint(options.e);
    const startX = pointer.x;
    const startY = pointer.y;
    let rect: Rect | undefined;
    let textbox: Textbox | undefined;

    const syncTextbox = () => {
      if (!canvas || !rect || !textbox) {
        return;
      }
      textbox.set({
        left: rect?.left,
        top: rect?.top,
        width: rect?.width,
      });
      canvas.renderAll();
    };
    // 鼠标移动时更新矩形大小
    canvas.on('mouse:move', (options) => {
      if (!canvas || !startX || !startY || getSelectedItems()?.length) {
        return;
      }
      const pointer = canvas.getScenePoint(options.e);
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
              if (canvas) {
                canvas.remove(transform.target);
                canvas.renderAll();
              }
            },
            actionName: 'delete',
            // 自定义渲染
            render(ctx, left, top, styleOverride, fabricObject) {
              ctx.save();
              ctx.translate(left, top);
              ctx.drawImage(deleteImg, 0, 0, 24, 24);
              ctx.restore();
            },
          });

          rect.controls.delete = deleteControl;

          rect.on('moving', syncTextbox);
          rect.on('modified', syncTextbox);
          canvas.add(rect);
        } else {
          rect.set({ width, height });
        }
      }
      canvas.renderAll();
    });

    // 鼠标释放时停止绘制
    canvas.on('mouse:up', () => {
      if (!canvas) {
        return;
      }
      if (rect) {
        textbox = new Textbox('标签名称', {
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
          if (canvas && textbox) {
            canvas.remove(textbox);
          }
        });
        canvas.add(textbox);
      }
      canvas.off('mouse:move');
      canvas.off('mouse:up');
    });
  });

  return canvas;
}
