
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
const isWithinDistance = (point1, point2, distance = 5) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy) <= distance;
};

export const handleCanvasClick = (event, toggleMode, setToggleMode, currentSlide, setCurrentSlide, currentCanvas, selectedContent, updateSlideData, selectedProperties, points, setPoints,connectionPoint, setConnectionPoint) => {
  if (toggleMode === null) return;
 console.log(connectionPoint);
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

        const createNewObject = (type, additionalProperties) => ({
          type,
          id: Date.now(),
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
          fill: selectedProperties?.fill || '#000000',
          fontSize: selectedProperties?.size,
          radius: selectedProperties?.size,
          width: selectedProperties?.size,
          height: selectedProperties?.size,
          ...additionalProperties,
          scaleX: selectedProperties?.scaleX,
          scaleY: selectedProperties?.scaleY,
        });

        // Handle "polygon" mode
    
if (toggleMode === 'polygon') {
  const newPoint = { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };

  // If there are more than 1 point, check if the new point is within distance of any existing points
  if (points.length > 1) {
    let foundConnection = false;
    for (let i = 0; i < points.length; i++) {
      if (isWithinDistance(newPoint, points[i])) {
        foundConnection = true;
        break;
      }
    }

    // If no connection point found, keep expanding the shape by adding the new point
    if (!foundConnection) {
      setPoints((prevPoints) => [...prevPoints, newPoint]);
    }

    // If there is a connection point (or the new point is within distance), create the polygon
    if (connectionPoint || foundConnection) {
      const newPolygon = createNewObject('polygon', { points: points });
      currentCanvasData.content = [...currentCanvasData.content, newPolygon];
      setToggleMode(null);
      setPoints([]); 
      setConnectionPoint(false);
    }
  } else {
    // If there's only 1 point, just keep adding new points
    setPoints((prevPoints) => [...prevPoints, newPoint]);
  }
}


        if (toggleMode === 'text') {
          const newTextObject = createNewObject('text', { text: 'New Text' });
          currentCanvasData.content = [...currentCanvasData.content, newTextObject];
        }

        if (toggleMode === 'circle') {
          const newCircle = createNewObject('circle', { radius: selectedProperties?.radius || 12 });
          currentCanvasData.content = [...currentCanvasData.content, newCircle];
        }

        if (toggleMode === 'square') {
          const newSquare = createNewObject('square', {
            width: selectedProperties?.width || 12,
            height: selectedProperties?.height || 12,
          });
          currentCanvasData.content = [...currentCanvasData.content, newSquare];
        }

        if (toggleMode === 'triangle') {
          const newTriangle = createNewObject('triangle', {
            width: selectedProperties?.size || 12,
            height: selectedProperties?.size || 12,
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
     if (toggleMode !== 'polygon') {
  setToggleMode(null); // Reset the toggle mode after click
  }
};


