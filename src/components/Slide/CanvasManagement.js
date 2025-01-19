
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