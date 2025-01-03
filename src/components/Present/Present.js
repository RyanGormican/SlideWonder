import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import { renderCanvasContent } from '../Slide/CanvasRender';
import { Icon } from '@iconify/react';

function Present({ currentSlide, setView }) {
  const [currentCanvasIndex, setCurrentCanvasIndex] = useState(0);
  const [hovering, setHovering] = useState(false);  // New state to handle hover
  const [fullscreen, setFullscreen] = useState(false);  // To track fullscreen state
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const controlsRef = useRef(null);  // Ref for the controls area

  const currentCanvasData = currentSlide?.deck[currentCanvasIndex];

  // Function to initialize and render the canvas
  const initializeCanvas = () => {
    if (!currentCanvasData || !canvasRef.current) return;

    // Initialize fabric.Canvas instance
    canvasInstance.current = new Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      preserveObjectStacking: true,
      backgroundColor: currentCanvasData.backgroundColor || '#ffffff',
    });

    // Render content on the canvas
    renderCanvasContent(canvasInstance.current, currentCanvasData.content, window.innerWidth, window.innerHeight);
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(document.fullscreenElement !== null);
      // Re-initialize the canvas when entering or exiting fullscreen
      initializeCanvas();
    };

    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Initialize the canvas when the component mounts
    initializeCanvas();

    // Cleanup on unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
      }
    };
  }, [currentCanvasIndex, currentCanvasData]);

  // Keyboard event listener effect
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          setView('slide'); // Escape to the slide view
          break;
        case 'ArrowRight':
          goToNextCanvas(); // Next canvas (slide)
          break;
        case 'ArrowLeft':
          goToPreviousCanvas(); // Previous canvas (slide)
          break;
        default:
          break;
      }
    };

    // Add event listener when component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentCanvasIndex, currentSlide, setView]);

  const goToNextCanvas = () => {
    if (currentCanvasIndex < currentSlide.deck.length - 1) {
      setCurrentCanvasIndex(currentCanvasIndex + 1);
    }
  };

  const goToPreviousCanvas = () => {
    if (currentCanvasIndex > 0) {
      setCurrentCanvasIndex(currentCanvasIndex - 1);
    }
  };

  // Detect clicks outside the controls area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target)) {
        setHovering(!hovering);
      }
    };

    // Add click event listener for outside clicks
    document.addEventListener('click', handleClickOutside);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  if (!currentSlide || !currentSlide.deck || currentSlide.deck.length === 0) {
    return <div>No content to present!</div>;
  }

  return (
    <div className="present-container" style={{ textAlign: 'center', position: 'relative' }}>
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

      {/* Navigation Buttons */}
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
        }}
        onMouseEnter={() => setHovering(true)}  
        onMouseLeave={() => setHovering(false)}  
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
      </div>

      {/* Show buttons and back icon on hover */}
      <div
        className="hover-area"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '10vh',
          zIndex:'1',
        }}
        onMouseEnter={() => setHovering(true)}  // Set hovering state to true
        onMouseLeave={() => setHovering(false)}  // Set hovering state to false
      />
    </div>
  );
}

export default Present;
