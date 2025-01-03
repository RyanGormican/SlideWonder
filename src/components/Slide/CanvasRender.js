import { IText } from 'fabric';

// Shared rendering function for canvas content
export const renderCanvasContent = (canvas, content, width, height) => {
  if (!canvas) {
    console.error("Canvas instance is not properly initialized.");
    return;
  }
  console.log(content);
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
          editable: true,
        });

        // Ensure text stays within canvas boundaries
        text.set({
          left: Math.max(0, Math.min(text.left, width - text.width)),
          top: Math.max(0, Math.min(text.top, height - text.height)),
        });

        // Add text to canvas
        canvas.add(text);
      }
    });
  }

  // Render the canvas after all content is added
  canvas.renderAll();
};
