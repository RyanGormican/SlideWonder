import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import { renderCanvasContent } from '../Slide/CanvasRender';
import { Icon } from '@iconify/react';
import { applyDissolveTransition , applySlideTransition ,applyScaleOutTransition, applyFlipTransition, applyRotateTransition } from './Transitions';
import { Keybinds } from './Keybinds';
function Present({ currentSlide, setView }) {
  const [currentCanvasIndex, setCurrentCanvasIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayDelay, setAutoPlayDelay] = useState(5); 
  const [loop, setLoop] = useState(false);
  const [showNotes, setShowNotes]=useState(false);
  const canvasRef = useRef(null);
  const nextCanvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const nextCanvasInstance = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const [opacity,setOpacity] = useState(1);
  const currentCanvasData = currentSlide?.deck[currentCanvasIndex];
  const [showPopoutNotes, setShowPopoutNotes] = useState(false);
  const [popoutWindow, setPopoutWindow] = useState(null);

const initializeCanvas = () => {
  if (!currentCanvasData || !canvasRef.current) return;

  // Dispose of the previous canvas instance if it exists
  if (canvasInstance.current) {
    canvasInstance.current.dispose();
  }

  // Reset opacity before rendering
  canvasRef.current.style.opacity = 1;

  // Initialize the current canvas
  canvasInstance.current = new Canvas(canvasRef.current, {
    width: window.innerWidth,
    height: window.innerHeight,
    preserveObjectStacking: true,
    backgroundColor: currentCanvasData.backgroundColor || '#ffffff',
    zIndex: 2,
  });

  // Determine the next canvas index (wraps around if at the end)
  const nextCanvasIndex = (currentCanvasIndex + 1) % currentSlide.deck.length;

  // Dispose of the previous nextCanvasInstance if it exists
  if (nextCanvasInstance.current) {
    nextCanvasInstance.current.dispose();
  }

  // Initialize the next canvas
  nextCanvasInstance.current = new Canvas(nextCanvasRef.current, {
    width: window.innerWidth,
    height: window.innerHeight,
    preserveObjectStacking: true,
    backgroundColor: currentSlide.deck[nextCanvasIndex].backgroundColor || '#ffffff',
    zIndex: 1,
  });

  // Render canvas content
  renderCanvasContent(canvasInstance.current, currentCanvasData.content, window.innerWidth, window.innerHeight, opacity);
  renderCanvasContent(nextCanvasInstance.current, currentSlide.deck[nextCanvasIndex].content, window.innerWidth, window.innerHeight, opacity);
};
const handlePopoutNotes = () => {
  if (showPopoutNotes) {
    if (!popoutWindow) {
      // Open a new window if it doesn't exist
      const newWindow = window.open('', '_blank', 'width=600,height=400');
      setPopoutWindow(newWindow);

      // Initialize content inside the new window
      newWindow.document.write(`
        <html>
          <head><title>Notes</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h3>Canvas Notes</h3>
            <p id="noteContent">Loading...</p>  <!-- Default loading message -->
          </body>
        </html>
      `);

      // Ensure that the content is updated immediately after writing to the window
      newWindow.document.close(); 

      // Update the content with the actual note right after writing the content
      const noteContent = currentCanvasData?.note && currentCanvasData?.note.length > 0
        ? currentCanvasData.note.join('\n')
        : 'No note here!';
      const noteElement = newWindow.document.getElementById('noteContent');
      if (noteElement) {
        noteElement.innerHTML = noteContent;  // Set the note content
      }
    } else {
      // If the window is already open, update the content immediately
      const noteContent = currentCanvasData?.note && currentCanvasData?.note.length > 0
        ? currentCanvasData.note.join('\n')
        : 'No note here!';
      const noteElement = popoutWindow.document.getElementById('noteContent');
      if (noteElement) {
        noteElement.innerHTML = noteContent;  // Update content
      }
    }
  } else {
    // Close the popout window if notes are not to be shown
    if (popoutWindow) {
      popoutWindow.close();
      setPopoutWindow(null);  
    }
  }
};






useEffect(() => {
  // Initialize canvas when the component mounts
  initializeCanvas();

  // Add resize event listener to re-render canvases on window resize
  const handleResize = () => {
    if (canvasInstance.current) {
      canvasInstance.current.clear();
      canvasInstance.current.setWidth(window.innerWidth);
      canvasInstance.current.setHeight(window.innerHeight);
      canvasInstance.current.backgroundColor = currentCanvasData.backgroundColor
    }
    if (nextCanvasInstance.current) {
      // Clear the next canvas before resizing
      nextCanvasInstance.current.clear();
      nextCanvasInstance.current.setWidth(window.innerWidth);
      nextCanvasInstance.current.setHeight(window.innerHeight);
    }
  
    renderCanvasContent(canvasInstance.current, currentCanvasData.content, window.innerWidth, window.innerHeight, opacity);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    if (canvasInstance.current) {
      canvasInstance.current.dispose();
    }
    if (nextCanvasInstance.current) {
      nextCanvasInstance.current.dispose();
    }
  };
}, [currentCanvasIndex, currentCanvasData, currentSlide.deck]);
  
const slideDirections = [
  'slideleft', 'slideright', 'slideup', 'slidedown', 
  'slidetopleft', 'slidetopright', 'slidebottomleft', 'slidebottomright'
];
 const goToNextCanvas = () => {
  if (currentCanvasIndex < currentSlide.deck.length - 1) {
    const currentCanvas = currentSlide.deck[currentCanvasIndex];
    const nextCanvas = currentSlide.deck[currentCanvasIndex + 1];
      renderCanvasContent(nextCanvasInstance.current, currentSlide.deck[(currentCanvasIndex + 1) % currentSlide.deck.length].content, window.innerWidth, window.innerHeight, opacity);
    switch (currentCanvas.transition) {
      case 'dissolve':
        applyDissolveTransition(currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex,opacity,setOpacity);
        break;
     case slideDirections.includes(currentCanvas.transition) && currentCanvas.transition:
    applySlideTransition( currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, currentCanvas.transition.replace('slide', '').toLowerCase());
    break;
      case 'scaleout':
      applyScaleOutTransition (currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, opacity, setOpacity);
      break;
    case 'fliphorizontal':
    applyFlipTransition(currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, 'horizontal');  
    break;
    case 'flipvertical':
    applyFlipTransition(currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, 'vertical'); 
    break;
        case 'rotateclockwise':
applyRotateTransition(currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, 'clockwise');  

    break;
        case 'rotatecounterclockwise':
applyRotateTransition(currentCanvas, nextCanvasRef, canvasRef, currentCanvasIndex, setCurrentCanvasIndex, 'counterclockwise');  
    break;
      default:
        setCurrentCanvasIndex(currentCanvasIndex + 1); 
        break;
    }
  } else if (loop) {
    setCurrentCanvasIndex(0); 
  }
};

  useEffect(() => {


  if (canvasRef.current){
  canvasRef.current.style.opacity = opacity;
  }

}, [opacity]);
  const goToPreviousCanvas = () => {
    if (currentCanvasIndex > 0) {
      setCurrentCanvasIndex(currentCanvasIndex - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };


  const startHoverTimer = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHovering(false);
    }, 3000);
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setHovering(true);
      startHoverTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
  handlePopoutNotes();
}, [currentCanvasIndex, currentCanvasData, showPopoutNotes]);

   useEffect(() => {
    const keydownHandler = Keybinds({
      currentSlide,
      currentCanvasIndex,
      setCurrentCanvasIndex,
      setView,
      loop,
      goToNextCanvas,
      goToPreviousCanvas,
      toggleFullscreen
    });
    window.addEventListener('keydown', keydownHandler);

    return () => {
      window.removeEventListener('keydown', keydownHandler);
    };
  }, [currentCanvasIndex, currentSlide, setView, loop, goToNextCanvas, goToPreviousCanvas, toggleFullscreen]);
  

  // Autoplay functionality
  useEffect(() => {
    if (autoPlay) {
      autoPlayTimerRef.current = setInterval(() => {
        goToNextCanvas();
      }, autoPlayDelay * 1000); // Delay in seconds 
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayDelay, currentCanvasIndex]);

  if (!currentSlide || !currentSlide.deck || currentSlide.deck.length === 0) {
    return <div>No content to present!</div>;
  }

  // Calculate progress percentage
  const progress = ((currentCanvasIndex + 1) / currentSlide.deck.length) * 100;


 

  return (
  <div>
      {showNotes && currentCanvasData?.note && currentCanvasData.note.length > 0 && (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: 0.4,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      padding: '20px',
      maxWidth: '80%',
      borderRadius: '8px',
      zIndex: 10,
      textAlign: 'center',
      fontSize: '18px',
    }}
  >
    {currentCanvasData.note.join('\n')}
  </div>
)}
    <div className="present-container locked" style={{ textAlign: 'center', position: 'absolute', cursor: hovering ? 'auto' : 'none',  overflow: 'hidden' }}>
      {/* Canvas */}
   
        <canvas style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2,
          margin: 0,
          padding: 0,
          position: 'absolute',
          overflow: 'hidden',
        }} ref={canvasRef} id="presentation-canvas" />
    
            <div
        style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          margin: 0,
          padding: 0,
          position: 'absolute',
          overflow: 'hidden',
        }}
      >
        <canvas style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          margin: 0,
          padding: 0,
          position: 'absolute',
          overflow: 'hidden',
        }} ref={nextCanvasRef} id="next-canvas" />
      </div>

      {/* Navigation and Autoplay Controls */}
      <div
        className="present-controls"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: hovering ? 'flex' : 'none',
          zIndex: '3',
          gap: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: '15px',
          borderRadius: '0',
          alignItems: 'center',
        }}
      >
        {/* Back Button */}
        <div
          style={{
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          <Icon
            icon="mingcute:back-line"
            width="24"
            height="24"
            color="white"
            onClick={() => setView('slide')}
          />
        </div>

        {/* Previous Button */}
        <button
          onClick={goToPreviousCanvas}
          disabled={currentCanvasIndex === 0}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: 'none',
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          Previous
        </button>

        {/* Next Button */}
        <button
          onClick={goToNextCanvas}
          disabled={currentCanvasIndex === currentSlide.deck.length - 1}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            border: 'none',
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          Next
        </button>

        {/* Progress Bar */}
        <div style={{ width: '200px', marginLeft: '20px' }}>
          <div style={{ width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', height: '8px', borderRadius: '4px' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
   

        {/* Slide Info */}
        <p style={{ color: '#fff', marginLeft: '10px' }}>
          Slide {currentCanvasIndex + 1} of {currentSlide.deck.length}
        </p>

        {/* Autoplay Toggle and Delay */}
        <div style={{ color: '#fff' }}>
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={(e) => setAutoPlay(e.target.checked)}
          />
          Auto Play
          {autoPlay && (
            <div>
              <label htmlFor="delay">Delay (seconds):</label>
              <input
                id="delay"
                type="number"
                value={autoPlayDelay}
                onChange={(e) => setAutoPlayDelay(parseFloat(e.target.value))}
                min="0.1"
                step="0.1"
              />
            </div>
          )}
        </div>

        {/* Loop Toggle */}
        <div style={{ color: '#fff' }}>
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
          />
          Loop
        </div>
         <div style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
    <input
      type="checkbox"
      checked={showNotes}
      onChange={() => setShowNotes(!showNotes)} 
      style={{ marginRight: '10px' }}
    />
    <span>Show Notes</span>
  </div>
  <div style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
  <input
    type="checkbox"
    checked={showPopoutNotes}
    onChange={() => {
      setShowPopoutNotes(!showPopoutNotes);
    }}
    style={{ marginRight: '10px' }}
  />
  <span>Popout Notes</span>
</div>

      </div>

      {/* Hover Area */}
      <div
        className="hover-area"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: '0',
           pointerEvents: 'none', 
        }}
        onMouseEnter={() => {
          setHovering(true);
          startHoverTimer();
        }}
        onMouseLeave={() => {
          setHovering(false);
          if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
          }
        }}
      />
    </div>
    </div>
  );
}

export default Present;