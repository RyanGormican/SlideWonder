export const applyDissolveTransition = (currentCanvas, nextCanvas, canvasRef, currentCanvasIndex, setCurrentCanvasIndex) => {
  const canvasDiv = canvasRef.current;

  // Set the initial opacity of the current canvas to 1
  canvasDiv.style.opacity = 1;

  // Transition duration and fade speed
  const duration = 1000; // Duration of the transition in milliseconds
  const fadeStep = 20; // Step interval for the fade (in ms)
  const fadeDuration = duration / fadeStep;

  let fadeOutInterval = setInterval(() => {
    // Fade out the current canvas (reduce opacity)
    if (parseFloat(canvasDiv.style.opacity) > 0) {
      canvasDiv.style.opacity = parseFloat(canvasDiv.style.opacity) - (1 / fadeDuration);
    }

    // When transition is complete, stop the interval and update the canvas index
    if (parseFloat(canvasDiv.style.opacity) <= 0) {
      clearInterval(fadeOutInterval);
      setCurrentCanvasIndex(currentCanvasIndex + 1); // Move to the next canvas
    }
  }, fadeStep);
};
export const applySlideTransition = (currentCanvas, nextCanvas, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, direction) => {
  const canvasDiv = canvasRef.current;

  // Transition duration for sliding
  const duration = 1000; // Duration of the transition in milliseconds

  // Set the initial position of the current canvas based on the direction
  const startPosition = {
    left: 'translateX(-100%)',    // Slide in from the right
    right: 'translateX(+100%)',  // Slide in from the left
    up: 'translateY(-100%)',      // Slide in from the bottom
    down: 'translateY(100%)',   // Slide in from the top
  }[direction] || 'translateX(100%)'; // Default to 'left'

  // Apply initial transform to slide the current canvas out
  canvasDiv.style.transition = `transform ${duration}ms ease-out`; // Smooth sliding
  canvasDiv.style.transform = startPosition;

  // When the transition finishes, update the canvas index and position of the next canvas
  setTimeout(() => {
    // After the slide-out is done, move to the next canvas
    setCurrentCanvasIndex(currentCanvasIndex + 1); // Move to the next canvas
  }, duration);
};
