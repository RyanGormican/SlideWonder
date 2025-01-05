import { IText, Circle, Polygon, Point, Triangle, Rect } from 'fabric';

// Helper function to calculate relative properties
const calculateRelativeProps = (width, height, xPercent, yPercent, size = {}) => {
  const relativePosition = {
    left: (width * xPercent) / 100,
    top: (height * yPercent) / 100,
  };

  const relativeSize = {
    width: size.width ? (width * size.width) / 100 : undefined,
    height: size.height ? (height * size.height) / 100 : undefined,
    radius: size.radius ? (Math.min(width, height) * size.radius) / 100 : undefined,  // For radius, use the smaller dimension
  };

  return {
    ...relativePosition,
    ...relativeSize,
  };
};

// Shared rendering function for canvas content
export const renderCanvasContent = (canvas, content, width, height) => {
  if (!canvas) {
    console.error("Canvas instance is not properly initialized.");
    return;
  }

  if (content) {
    content.forEach((item) => {
      const { x, y, angle, fill, scaleX, scaleY, id, size = {} } = item;

      // Calculate relative position and size for each item
      const { left, top, width: relWidth, height: relHeight, radius: relRadius } = calculateRelativeProps(width, height, x, y, size);

      // Common object properties to be used for all types
      const commonProps = {
        left,
        top,
        angle: angle || 0,
        id: id,
        scaleX: scaleX || 1,
        scaleY: scaleY || 1,
        editable: true,
        fill: fill || 'black',
      };

      if (item.type === 'text' && item.text.trim() !== '') {
        const text = new IText(item.text, {
          ...commonProps,
          fontSize: item.fontSize || 30,
        });
        canvas.add(text);

      } else if (item.type === 'circle') {
        const circle = new Circle({
          ...commonProps,
          radius: relRadius || 12,  // Use the relative radius calculation
        });
        canvas.add(circle);

      } else if (item.type === 'square') {
        const square = new Rect({
          ...commonProps,
          width: relWidth || 12,  // Use the relative width calculation
          height: relHeight || 12,  // Use the relative height calculation
        });
        canvas.add(square);

      } else if (item.type === 'triangle') {
        const triangle = new Triangle({
          ...commonProps,
          width: relWidth || 12,  // Use the relative width calculation
          height: relHeight || 12,  // Use the relative height calculation
        });
        canvas.add(triangle);
      }
    });
  }

  // Render the canvas after all content is added
  canvas.renderAll();
};
