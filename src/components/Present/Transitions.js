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


  const duration = currentCanvas.duration * 1000;

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

export const applyScaleOutTransition = (currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex) => {
  const canvasDiv = document.getElementById('presentation-canvas');
  

  const duration = currentCanvas.duration * 1000; 
  
  // Apply initial transform to shrink the canvas and move it to the center
  canvasDiv.style.transition = `transform ${duration}ms ease-out`; 
  canvasDiv.style.transform = 'scale(0.001) translate(-50%, -50%)';  // Shrink and center the canvas

  // When the transition finishes, update the canvas index and move to the next canvas
  setTimeout(() => {
    setCurrentCanvasIndex(currentCanvasIndex + 1); // Move to the next canvas
  }, duration);
};

export const applyFlipTransition = (currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, flipDirection) => {
  const canvasDiv = document.getElementById('presentation-canvas');
  
  // Use the dynamic duration from currentCanvas
  const duration = currentCanvas.duration * 1000; // Convert from seconds to milliseconds
  
  // Apply initial flip effect based on the flipDirection
  let flipTransform = '';
  if (flipDirection === 'horizontal') {
    flipTransform = 'rotateY(180deg)'; // Flip horizontally
  } else if (flipDirection === 'vertical') {
    flipTransform = 'rotateX(180deg)'; // Flip vertically
  }

  // Apply the flip transition
  canvasDiv.style.transition = `transform ${duration}ms ease-out`; 
  canvasDiv.style.transform = flipTransform;  // Apply the flip

  // After the flip transition finishes, move to the next canvas
  setTimeout(() => {
    setCurrentCanvasIndex(currentCanvasIndex + 1); // Move to the next canvas
  }, duration);
};
export const applyRotateTransition = (currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, direction) => {
  const canvasDiv = document.getElementById('presentation-canvas');
  
  // Use the dynamic duration from currentCanvas
  const duration = currentCanvas.duration * 1000; // Convert from seconds to milliseconds
  
  // Determine the rotate direction
  let rotateDirection = '';
  if (direction === 'clockwise') {
    rotateDirection = 'rotate(360deg)'; // Rotate clockwise
  } else if (direction === 'counterclockwise') {
    rotateDirection = 'rotate(-360deg)'; // Rotate counterclockwise
  }

  // Apply the rotate transition
  canvasDiv.style.transition = `transform ${duration}ms ease-out`; 
  canvasDiv.style.transform = rotateDirection;  // Apply rotation

  // After the rotate transition finishes, move to the next canvas
  setTimeout(() => {
    setCurrentCanvasIndex(currentCanvasIndex + 1); // Move to the next canvas
  }, duration);
};
export const applyZoomInTransition = (currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex) => {
  const canvasDiv = document.getElementById('presentation-canvas');

  // Use the dynamic duration from currentCanvas
  const duration = currentCanvas.duration * 1000; // Convert from seconds to milliseconds

  // Set the initial state for zoom-in
  canvasDiv.style.transform = 'scale(50)'; // Start small
  canvasDiv.style.transition = `transform ${duration}ms ease-out`; // Smooth zoom-in effect

 
  // Once the transition is complete, move to the next canvas
  setTimeout(() => {
    setCurrentCanvasIndex(currentCanvasIndex + 1); // Move to the next canvas
  }, duration);
};
