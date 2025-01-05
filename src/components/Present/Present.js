import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import { renderCanvasContent } from '../Slide/CanvasRender';
import { Icon } from '@iconify/react';

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          setView('slide');
          break;
        case 'ArrowRight':
        case 'Enter':
        case ' ':
          goToNextCanvas();
          break;
        case 'ArrowLeft':
        case 'Shift+ ':
          goToPreviousCanvas();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'Home':
          // Jump to the first canvas
          setCurrentCanvasIndex(0);
          break;
        case 'End':
          // Jump to the last canvas
          setCurrentCanvasIndex(currentSlide.deck.length - 1);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          // Jump to a specific slide (1-9)
          const slideIndex = parseInt(e.key) - 1;
          if (slideIndex < currentSlide.deck.length) {
            setCurrentCanvasIndex(slideIndex);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentCanvasIndex, currentSlide, setView]);

  const goToNextCanvas = () => {
    if (currentCanvasIndex < currentSlide.deck.length - 1) {
      setCurrentCanvasIndex(currentCanvasIndex + 1);
    } else if (loop) {
      setCurrentCanvasIndex(0); // Go back to the beginning if loop is enabled
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

  // Autoplay functionality
  useEffect(() => {
    if (autoPlay) {
      autoPlayTimerRef.current = setInterval(() => {
        goToNextCanvas();
      }, autoPlayDelay * 1000); // Delay in seconds (with decimal support)
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
