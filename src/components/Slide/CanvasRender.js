import { IText, Circle,Polygon, Point, Triangle , Rect} from 'fabric';

// Shared rendering function for canvas content
export const renderCanvasContent = (canvas, content, width, height) => {
  if (!canvas) {
    console.error("Canvas instance is not properly initialized.");
    return;
  }
  if (content) {
    content.forEach((item) => {
      if (item.type === 'text' && item.text.trim() !== '') {
        const relativeX = (width * item.x) / 100;
        const relativeY = (height * item.y) / 100;

        const text = new IText(item.text, {
          left: relativeX,
          top: relativeY,
          fontSize: item.fontSize || 30,
          fill: item.color || 'black',
          angle: item.angle || 0,
          id: item.id,
          scaleX: item.scaleX || 1,
          scaleY: item.scaleY || 1,
          editable: true,
        });

        // Ensure text stays within canvas boundaries
        text.set({
          left: Math.max(0, Math.min(text.left, width - text.width)),
          top: Math.max(0, Math.min(text.top, height - text.height)),
        });

        // Add text to canvas
        canvas.add(text);
      } else if (item.type === 'circle') {
          const relativeX = (width * item.x) / 100;
        const relativeY = (height * item.y) / 100;

        const circle = new Circle({
          left: relativeX,
          top: relativeY,
          radius: item.radius || 12,
          fill: item.fill || 'black',
          angle: item.angle || 0,
          id: item.id,
          scaleX: item.scaleX || 1,
          scaleY: item.scaleY || 1,
          editable: true,
        });

        // Ensure text stays within canvas boundaries
        circle.set({
          left: Math.max(0, Math.min(circle.left, width - circle.width)),
          top: Math.max(0, Math.min(circle.top, height - circle.height)),
        });

        // Add circle to canvas
        canvas.add(circle);
      }else if (item.type === 'square') {
          const relativeX = (width * item.x) / 100;
        const relativeY = (height * item.y) / 100;

        const square = new Rect({
          left: relativeX,
          top: relativeY,
          height: item.height || 12,
          width: item.width || 12,
          fill: item.fill || 'black',
          angle: item.angle || 0,
          id: item.id,
          scaleX: item.scaleX || 1,
          scaleY: item.scaleY || 1,
          editable: true,
        });

        // Ensure text stays within canvas boundaries
        square.set({
          left: Math.max(0, Math.min(square.left, width - square.width)),
          top: Math.max(0, Math.min(square.top, height - square.height)),
        });

        // Add square to canvas
        canvas.add(square);
      } else if (item.type === 'triangle') {
          const relativeX = (width * item.x) / 100;
        const relativeY = (height * item.y) / 100;

        const triangle = new Triangle({
          left: relativeX,
          top: relativeY,
          height: item.height || 12,
          width: item.width || 12,
          fill: item.fill || 'black',
          angle: item.angle || 0,
          id: item.id,
          scaleX: item.scaleX || 1,
          scaleY: item.scaleY || 1,
          editable: true,
        });

        // Ensure text stays within canvas boundaries
        triangle.set({
          left: Math.max(0, Math.min(triangle.left, width - triangle.width)),
          top: Math.max(0, Math.min(triangle.top, height - triangle.height)),
        });

        // Add triangle to canvas
        canvas.add(triangle);
      }
    });
  }

  // Render the canvas after all content is added
  canvas.renderAll();
};
