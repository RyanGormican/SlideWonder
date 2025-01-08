
  export const applyDissolveTransition = (currentCanvas, nextCanvas,canvasRef, currentCanvasIndex, setCurrentCanvasIndex) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    // Fade out current canvas
    canvasElement.style.transition = 'opacity 1s ease-out';
    canvasElement.style.opacity = 0;

    // Wait for the fade-out animation to complete
    setTimeout(() => {
      // render the next canvas
      setCurrentCanvasIndex(currentCanvasIndex + 1);

      // Fade in the next canvas
      const nextCanvasElement = canvasRef.current;
      if (nextCanvasElement) {
        nextCanvasElement.style.transition = 'opacity 1s ease-in';
        nextCanvasElement.style.opacity = 1;
      }
    }, 1000); // Wait  1 second
  };
  export const applyFadeInTransition = (currentCanvas, nextCanvas, canvasRef, currentCanvasIndex, setCurrentCanvasIndex) => {
  const nextSlideElement = canvasRef.current;

  // Initial state - hide the next slide
  nextSlideElement.style.opacity = 0;
  nextSlideElement.style.transition = 'opacity 1s ease-in-out';

  // Trigger the transition
  setTimeout(() => {
    nextSlideElement.style.opacity = 1;
  }, 10);

  // Update canvas index after the transition duration
  setTimeout(() => {
    setCurrentCanvasIndex(currentCanvasIndex + 1);
  }, 1000); // Wait for the transition to finish before updating the index
};

  export const applySlideInLeftTransition = (currentCanvas, nextCanvas, canvasRef, currentCanvasIndex, setCurrentCanvasIndex) => {
  const nextSlideElement = canvasRef.current;

  // Initial state - hide the next slide to the left
  nextSlideElement.style.transform = 'translateX(-100%)';
  nextSlideElement.style.transition = 'transform 1s ease-in-out';

  // Trigger the transition
  setTimeout(() => {
    nextSlideElement.style.transform = 'translateX(0)';
  }, 10);

  // Update canvas index after the transition duration
  setTimeout(() => {
    setCurrentCanvasIndex(currentCanvasIndex + 1);
  }, 1000); // Wait for the transition to finish before updating the index
};
