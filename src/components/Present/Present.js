import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import { renderCanvasContent } from '../Slide/CanvasRender';
import { Icon } from '@iconify/react';
import { applyDissolveTransition , applyFadeInTransition, applySlideInLeftTransition } from './Transitions';
import { Keybinds } from './Keybinds';
function Present({ currentSlide, setView }) {
  const [currentCanvasIndex, setCurrentCanvasIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoPlayDelay, setAutoPlayDelay] = useState(5); // Initial value in seconds
  const [loop, setLoop] = useState(false);

  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const controlsRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  const currentCanvasData = currentSlide?.deck[currentCanvasIndex];

  const initializeCanvas = () => {
    if (!currentCanvasData || !canvasRef.current) return;

    // Reset opacity before rendering
    canvasRef.current.style.opacity = 1;

    canvasInstance.current = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      preserveObjectStacking: true,
      backgroundColor: currentCanvasData.backgroundColor || '#ffffff',
    });

    renderCanvasContent(canvasInstance.current, currentCanvasData.content, window.innerWidth, window.innerHeight);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(document.fullscreenElement !== null);
      initializeCanvas();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    initializeCanvas();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
      }
    };
  }, [currentCanvasIndex, currentCanvasData]);

  

 const goToNextCanvas = () => {
  if (currentCanvasIndex < currentSlide.deck.length - 1) {
    const currentCanvas = currentSlide.deck[currentCanvasIndex];
    const nextCanvas = currentSlide.deck[currentCanvasIndex + 1];

    // Add more transition cases here
    switch (currentCanvas.transition) {
      case 'dissolve':
        applyDissolveTransition(currentCanvas, nextCanvas, canvasRef, currentCanvasIndex, setCurrentCanvasIndex);
        break;
      case 'slideInLeft':
        applySlideInLeftTransition(currentCanvas, nextCanvas, canvasRef, currentCanvasIndex, setCurrentCanvasIndex);
        break;
      case 'fadeIn':
        applyFadeInTransition(currentCanvas, nextCanvas, canvasRef, currentCanvasIndex, setCurrentCanvasIndex);
        break;
      default:
        setCurrentCanvasIndex(currentCanvasIndex + 1); 
        break;
    }
  } else if (loop) {
    setCurrentCanvasIndex(0); 
  }
};


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
    <div className="present-container" style={{ textAlign: 'center', position: 'relative', cursor: hovering ? 'auto' : 'none' }}>
      {/* Canvas */}
      <div
        style={{
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          margin: 0,
          padding: 0,
          position: 'relative',
        }}
      >
        <canvas ref={canvasRef} id="presentation-canvas" />
      </div>

      {/* Navigation and Autoplay Controls */}
      <div
        ref={controlsRef}
        className="present-controls"
        style={{
          position: 'absolute',
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
          zIndex: '1',
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
  );
}

export default Present;
