
export const copyCanvas = (canvas,currentSlide,setCurrentSlide,updateSlideData) => {
const canvasId = canvas
  const canvasToCopy = currentSlide.deck.find((canvas) => canvas.id === canvasId);

  if (!canvasToCopy) {
    console.error('Canvas not found');
    return;
  }

  const copiedCanvas = {
    ...canvasToCopy,
    id: Date.now(), // Assign a new unique ID
  };
  const updatedSlide = {
    ...currentSlide,
    deck: [...currentSlide.deck, copiedCanvas],
  };

  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide);
};

export const copyCanvasElement = (selectedContent,setCopiedContent) => {
  if (!selectedContent) return; // If nothing is selected, do nothing
  setCopiedContent(selectedContent); // Copy the selected content
};

export const handleCanvasClick = (event,toggleMode,setToggleMode, currentSlide,setCurrentSlide, currentCanvas,selectedContent, updateSlideData) => {
  if (toggleMode === null) return;

  const canvasElement = event.target;
  const canvasWidth = canvasElement.width;
  const canvasHeight = canvasElement.height;

  const updatedSlide = {
    ...currentSlide,
    deck: currentSlide.deck.map((canvas) => {
      if (canvas.id === currentCanvas) {
        const currentCanvasData = { ...canvas }; // Copy canvas data

        // Initialize content if it is null
        currentCanvasData.content = currentCanvasData.content || [];


        const contentSize = Math.max(
    selectedContent?.fontSize || 12,
    selectedContent?.radius || 12,
    selectedContent?.width ||12,
    selectedContent?.height || 12
  );
        const createNewObject = (type, additionalProperties) => ({
          type,
          id: Date.now(),
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
          fill: selectedContent?.fill || '#000000',
          fontSize: contentSize,
    radius: contentSize,
    width: contentSize,
    height: contentSize,
          ...additionalProperties,
        });

        if (toggleMode === 'text') {
          const newTextObject = createNewObject('text', { text: 'New Text' });
          currentCanvasData.content = [...currentCanvasData.content, newTextObject];
        }

        if (toggleMode === 'circle') {
          const newCircle = createNewObject('circle', { radius: selectedContent?.radius || 12 });
          currentCanvasData.content = [...currentCanvasData.content, newCircle];
        }

        if (toggleMode === 'square') {
          const newSquare = createNewObject('square', {
            width: selectedContent?.width || 12,
            height: selectedContent?.height || 12,
          });
          currentCanvasData.content = [...currentCanvasData.content, newSquare];
        }

        if (toggleMode === 'triangle') {
          const newTriangle = createNewObject('triangle', {
            width: selectedContent?.size || 12,
            height: selectedContent?.size || 12,
          });
          currentCanvasData.content = [...currentCanvasData.content, newTriangle];
        }
         if (toggleMode === 'image') {
          const newImage = createNewObject('image', { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvk-ecPeKuRvec5czcoK2H7axiY9XZtcqopQ&s' });
          currentCanvasData.content = [...currentCanvasData.content, newImage];
        }
        return currentCanvasData;
      }
      return canvas;
    }),
  };

  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide);

  setToggleMode(null);
};

