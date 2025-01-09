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
        canvas.id === canvasId ? { ...canvas, transition: contentType } : canvas
      );
      const updatedSlide = { ...currentSlide, deck: updatedDeck };
      setCurrentSlide(updatedSlide);
      updateSlideData(updatedSlide);
};
// Function to delete the transition
export const deleteTransition = (canvasId,currentSlide,setCurrentSlide,updateSlideData) => {
  const updatedSlide = { ...currentSlide };

  // Find the canvas by its ID
  const currentCanvasData = updatedSlide.deck.find((canvas) => canvas.id === canvasId);

  if (!currentCanvasData) return;

  // Set the transition to null
  currentCanvasData.transition = null;

  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide);
};
export function formatTransition(transition) {
  return transition
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, char => char.toUpperCase());
}