export const applyDissolveTransition = (currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, opacity, setOpacity) => {
  let grabCapacity = opacity;
  
  // Use the dynamic duration from currentCanvas
  const duration = currentCanvas.duration * 1000; // Convert from seconds to milliseconds
  const fadeStep = 20; // Step interval for the fade (in ms)
  const fadeDuration = duration / fadeStep;
  
  let fadeOutInterval = setInterval(() => {
    // Fade out the current canvas (reduce opacity)
    if (grabCapacity > 0) {
      grabCapacity = (parseFloat(grabCapacity) - (1 / fadeDuration));
      setOpacity(parseFloat(grabCapacity) - (1 / fadeDuration));
    }

    // When transition is complete, stop the interval and update the canvas index
    if (grabCapacity <= 0) {
      clearInterval(fadeOutInterval);
      setOpacity(1);
      setCurrentCanvasIndex(currentCanvasIndex + 1); // Move to the next canvas
    }
  }, fadeStep);
};

export const applySlideTransition = (currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, direction) => {
  const canvasDiv = document.getElementById('presentation-canvas');

  // Use the dynamic duration from currentCanvas
  const duration = currentCanvas.duration * 1000; // Convert from seconds to milliseconds

  // Set the initial position of the current canvas based on the direction
  const startPosition = {
    left: 'translateX(-100%)',    // Slide in from the right
    right: 'translateX(+100%)',   // Slide in from the left
    up: 'translateY(-100%)',      // Slide in from the bottom
    down: 'translateY(100%)',     // Slide in from the top
    topleft: 'translateX(-100%) translateY(-100%)',   // Slide in from top-left corner
    topright: 'translateX(100%) translateY(-100%)',   // Slide in from top-right corner
    bottomleft: 'translateX(-100%) translateY(100%)', // Slide in from bottom-left corner
    bottomright: 'translateX(100%) translateY(100%)', // Slide in from bottom-right corner
  }[direction] || 'translateX(100%)'; // Default to 'left'

  nextCanvasRef.current.style.zIndex = 2;

  // Apply initial transform to slide the current canvas out
  canvasDiv.style.transition = `transform ${duration}ms ease-out`; // Smooth sliding
  canvasDiv.style.transform = startPosition;

  // When the transition finishes, update the canvas index and position of the next canvas
  setTimeout(() => {
    // After the slide-out is done, move to the next canvas
    setCurrentCanvasIndex(currentCanvasIndex + 1); // Move to the next canvas
  }, duration);
};
