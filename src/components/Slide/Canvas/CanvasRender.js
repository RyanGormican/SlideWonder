import { IText, FabricImage, Image, Circle, Polygon, Point, Triangle, Rect } from 'fabric';

// Helper function to calculate scaled properties
const calculateScaledProps = (width, height, x, y, size = {}, scaleX , scaleY) => {
  const xScale = width / 800; // Calculate width scaling factor
  const yScale = height / 600; // Calculate height scaling factor

  const scaledPosition = {
    left: x * xScale, // Scale x using the xScale factor
    top: y * yScale, // Scale y using the yScale factor
  };

  const scaledSize = {
    width: size.width ? size.width * xScale : 12, // Scale width using xScale
    height: size.height ? size.height * yScale : 12, // Scale height using yScale
    radius: size.radius ? size.radius * Math.min(xScale, yScale) : 1,
    fontSize: size.fontSize ? size.fontSize * Math.min(xScale, yScale) : 12,
  };

    const originalCircleArea = Math.PI * Math.pow(size.radius, 2); 
    const originalContainerArea = 800 * 600;
    const originalAreaPercentage = (originalCircleArea / originalContainerArea) * 100;

    const newRadius = Math.sqrt((originalAreaPercentage / 100) * width * height / Math.PI);
    scaledSize.radius = newRadius;


    const originalTextArea = Math.pow(size.fontSize, 2); 
    const originalTextAreaPercentage = (originalTextArea / originalContainerArea) * 100;

    const newFontSize = Math.sqrt((originalTextAreaPercentage / 100) * width * height);
    scaledSize.fontSize = newFontSize;
  
  const reverseScaleX = scaleX * 1;
  const reverseScaleY = scaleY * 1;

  return {
    ...scaledPosition,
    ...scaledSize,
    scaleX: reverseScaleX, 
    scaleY: reverseScaleY, 
  };
};


// Shared rendering function for canvas content
export const renderCanvasContent = (canvas, content, width, height, opacity) => {
  if (!canvas) {
    console.error("Canvas instance is not properly initialized.");
    return;
  }

  if (content) {
    content.forEach((item) => {
      const { 
        x, y, angle, fill, scaleX, scaleY, size, id, 
        url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvk-ecPeKuRvec5czcoK2H7axiY9XZtcqopQ&s' 
      } = item;

      // Directly access width, height, and radius from item
      const { width: itemWidth, height: itemHeight, radius: itemRadius, fontSize: itemFontSize, opacity: itemOpacity} = item;

      // Calculate scaled position, size, scaleX, and scaleY for each item
      const { 
        left, top, width: scaledWidth, height: scaledHeight, radius: scaledRadius, 
        fontSize: scaledFontSize, scaleX: scaledScaleX, scaleY: scaledScaleY 
      } = calculateScaledProps(
        width, height, x, y, { width: itemWidth, height: itemHeight, radius: itemRadius, fontSize: itemFontSize },
        scaleX, scaleY
      );

      
      // Common object properties to be used for all types
      const commonProps = {
        left,
        top,
        angle: angle || 0,
        id: id,
        scaleX: scaledScaleX, 
        scaleY: scaledScaleY, 
        editable: true,
        fill: fill || 'black',
        opacity: Math.min(opacity || 1, itemOpacity || 1), 
      };

      if (item.type === 'text' && item.text.trim() !== '') {
        const text = new IText(item.text, {
          ...commonProps,
          scaleX: scaledScaleX * (width/800),
          scaleY: scaledScaleY * (height/600),
          fontSize: itemFontSize || 30, 
        });
        canvas.add(text);

      } else if (item.type === 'circle') {
        const circle = new Circle({
          ...commonProps,
          scaleX: scaledScaleX * (width/800),
          scaleY: scaledScaleY * (height/600),
          radius: itemRadius || 12, 
        });
        canvas.add(circle);

      } else if (item.type === 'square') {
        const square = new Rect({
          ...commonProps,
          scaleX: scaledScaleX * (width/800),
          scaleY: scaledScaleY * (height/600),
          width: itemWidth || 12, 
          height: itemWidth || 12,
        });
 
        canvas.add(square);

      } else if (item.type === 'triangle') {
        const triangle = new Triangle({
          ...commonProps,
          scaleX: scaledScaleX * (width/800),
          scaleY: scaledScaleY * (height/600),
          width: itemWidth || 12, 
          height: itemWidth || 12, 
        });
        canvas.add(triangle);

      } else if (item.type === 'image') {
        FabricImage.fromURL(item.src, (img) => {
          img.set({
            ...commonProps,
            width: scaledWidth || img.width,
            height: scaledHeight || img.height,
          });
          canvas.add(img);
        });
      }
    });
  }

  // Render the canvas after all content is added
  canvas.renderAll();
};
