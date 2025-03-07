// Handle drag start on transition items
export const handleDragStart = (event, contentType) => {
  event.dataTransfer.setData("text", contentType); // Store content type
};

// Handle drag over on canvas
export const handleDragOver = (event) => {
  event.preventDefault(); // Allow the drop by preventing the default behavior
};

// Handle drop on canvas
export const handleDrop = (event, canvasId,currentSlide,setCurrentSlide,updateSlideData) => {
  event.preventDefault();
  const contentType = event.dataTransfer.getData("text"); // Get the dropped content type
  if (contentType){
  addTransitionToCanvas(contentType, canvasId,currentSlide,setCurrentSlide,updateSlideData); // Pass canvasId to addTransitionToCanvas
  };
};

// Add transition to the specific canvas
export const addTransitionToCanvas = (contentType, canvasId,currentSlide,setCurrentSlide,updateSlideData) => {
      const updatedDeck = currentSlide.deck.map((canvas) =>
        canvas.id === canvasId ? { ...canvas, transition: contentType, duration:1 } : canvas
      );
      const updatedSlide = { ...currentSlide, deck: updatedDeck };
      setCurrentSlide(updatedSlide);
      updateSlideData(updatedSlide,1,1);
};
// Function to delete the transition
export const deleteTransition = (canvasId,currentSlide,setCurrentSlide,updateSlideData) => {
  const updatedSlide = { ...currentSlide };

  // Find the canvas by its ID
  const currentCanvasData = updatedSlide.deck.find((canvas) => canvas.id === canvasId);

  if (!currentCanvasData) return;

  // Set the transition to null
  currentCanvasData.transition = null;
  currentCanvasData.duration = null;
  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide,1,1);
};
export function formatTransition(transition,transitions) {
   const title = transitions.find(t => t.id === transition);
  return title ? title.title : null;
}

// Update canvas duration
export const updateCanvasDuration = (e, canvasId, currentSlide, setCurrentSlide, updateSlideData) => {
  let newDuration = e.target.value; 
  if (newDuration < 0.1) {
    newDuration = 0.1;
  }
  if (newDuration > 12) {
    newDuration = 12;
  }

  // Update the duration in the specific canvas
  const updatedDeck = currentSlide.deck.map((canvas) => {
    if (canvas.id === canvasId) {
      return { ...canvas, duration: newDuration };
    }
    return canvas;
  });

  // Update the slide with the new deck
  const updatedSlide = { ...currentSlide, deck: updatedDeck };
  
  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide, 1, 1);
};
