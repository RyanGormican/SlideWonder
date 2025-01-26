
export const handleObjectModified = (e, getSelectedContentType,currentSlide,currentCanvas, setCurrentSlide, updateSlideData) => {

  const object = e.target;
  const contentType = getSelectedContentType(object.id); // Get the content type
  
  // Declare width and height with let so they can be reassigned
  let width = object.width ? (object.width ) * 1 : 1;
  let height = object.height ? (object.height) * 1 : 1;

  // If the content type is square, set width and height to the minimum of the two
  if (contentType === 'square') {
    const minDimension = Math.min(width, height);
    width = height = minDimension; // Make height and width equal
  }
  
  // Create a shallow copy of the current slide
  const updatedSlide = {
    ...currentSlide,
    deck: currentSlide.deck.map((canvas) => {
      if (canvas.id === currentCanvas) {
        // Modify the canvas content if it matches the current canvas
        return {
          ...canvas,
          content: canvas?.content
            ? canvas?.content.map((item) =>
                item.id === object.id
                  ? {
                      ...item,
                      x: object.left,
                      y: object.top,
                      width:  object.width ? (object.width ) * 1 : 1,
                      radius: object.radius ? (object.radius ) * 1 : 1,
                      height:  object.height ? (object.height ) * 1 : 1,
                      angle: object.angle,
                      text: object.textLines ? object.textLines[0] : item.text,
                      fontSize: object.fontSize ? (object.fontSize) * 1 : 12,
                      fill: object.fill || '#FFFFFF',
                      scaleX: object.scaleX || 1,
                      scaleY: object.scaleY || 1,
                      opacity: object.opacity || 1,
                    }
                  : item
              )
            : [],
        };
      }
      return canvas;
    }),
  };
  // Update state and persist changes
  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide);
};

