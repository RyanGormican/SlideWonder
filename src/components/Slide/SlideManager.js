import React, { useState, useEffect, useRef } from 'react';
import { renderCanvasContent } from './CanvasRender';  // Import the shared function
import DraggableCanvas from './DraggableCanvas';
import { Icon } from '@iconify/react';
import { Canvas, IText } from 'fabric';

function SlideManager({ slides, setSlides, currentSlide, setCurrentSlide }) {
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [toggleMode, setToggleMode] = useState(null);
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);

  const updateSlideData = (updatedSlide) => {
    const updatedSlides = slides.map((slide) =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    );
    setSlides(updatedSlides);
    localStorage.setItem(
      'SlideWonderdata',
      JSON.stringify({ slides: updatedSlides })
    );
  };

  const addCanvasToDeck = () => {
    if (!currentSlide) {
      alert('Please select a slide first!');
      return;
    }

    const newCanvas = {
      id: Date.now(),
      content: null, // Initialize content as null
      backgroundColor: '#ffffff',
      text: '', // Initialize text property
    };

    const updatedSlide = {
      ...currentSlide,
      deck: [...currentSlide.deck, newCanvas],
    };

    setCurrentSlide(updatedSlide);
    updateSlideData(updatedSlide);
  };

  const deleteCanvas = (canvasId) => {
    const updatedDeck = currentSlide.deck.filter((canvas) => canvas.id !== canvasId);
    const updatedSlide = { ...currentSlide, deck: updatedDeck };
    setCurrentSlide(updatedSlide);
    updateSlideData(updatedSlide);
  };

  const moveCanvas = (fromIndex, toIndex) => {
    const updatedDeck = [...currentSlide.deck];
    const [movedCanvas] = updatedDeck.splice(fromIndex, 1);
    updatedDeck.splice(toIndex, 0, movedCanvas);

    const updatedSlide = { ...currentSlide, deck: updatedDeck };
    setCurrentSlide(updatedSlide);
    updateSlideData(updatedSlide);
  };

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setBackgroundColor(newColor);

    if (currentCanvas) {
      const updatedDeck = currentSlide.deck.map((canvas) =>
        canvas.id === currentCanvas ? { ...canvas, backgroundColor: newColor } : canvas
      );
      const updatedSlide = { ...currentSlide, deck: updatedDeck };
      setCurrentSlide(updatedSlide);
      updateSlideData(updatedSlide);
    }
  };

  const handleObjectModified = (e) => {
  const object = e.target;

  // Create a shallow copy of the current slide
  const updatedSlide = { 
    ...currentSlide, 
    deck: currentSlide.deck.map((canvas) => {
      if (canvas.id === currentCanvas) {
        // Modify the canvas content if it matches the current canvas
        return {
          ...canvas,
          content: canvas.content
            ? canvas.content.map((item) =>
                item.id === object.id
                  ? {
                      ...item,
                      x: (object.left/800 * 100),
                      y: (object.top/600 * 100),
                      width: object.width,
                      height: object.height,
                      angle: object.angle,
                      text: object.textLines ? object.textLines[0] : item.text,
                      fontSize: object.fontSize,
                      color: object.fill,
                    }
                  : item
              )
            : [],
        };
      }
      return canvas;
    }),
  };
  // Update state and persist changes
  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide);
};


  const handleCanvasClick = (event) => {
    if (toggleMode === null) return;

    const canvasElement = event.target;
    const canvasWidth = canvasElement.width;
    const canvasHeight = canvasElement.height;

    // Get mouse position relative to canvas
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    // Calculate percentage position
    const xPercentage = (x / canvasWidth) * 100;
    const yPercentage = (y / canvasHeight) * 100;

    const updatedSlide = { ...currentSlide };

    const currentCanvasData = updatedSlide.deck.find((canvas) => canvas.id === currentCanvas);

    if (!currentCanvasData) {
      console.error("Canvas with id", currentCanvas, "not found.");
      return;
    }

    // Initialize content if it is null
    if (!currentCanvasData.content) {
      currentCanvasData.content = [];
    }

    // Append the new text object to the content of the canvas
    const newTextObject = {
      type: 'text',
      id: Date.now(),
      text: 'New Text', // Placeholder text
      x: xPercentage,  // Position as percentage
      y: yPercentage,  // Position as percentage
      fontSize: 12,    // Default font size
    };

    currentCanvasData.content.push(newTextObject);

    // Update the current slide with the new content
    setCurrentSlide(updatedSlide);
    updateSlideData(updatedSlide);

    setToggleMode(null);
  };

  useEffect(() => {
    const currentCanvasData = currentSlide?.deck.find((canvas) => canvas.id === currentCanvas);
    const backgroundColor = currentCanvasData?.backgroundColor || '#ffffff';

    setBackgroundColor(backgroundColor);

    if (canvasRef.current) {
      // Create new Canvas instance
      canvasInstance.current = new Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        preserveObjectStacking: true,
        backgroundColor: backgroundColor,
      });

      const updatedSlide = {
        ...currentSlide,
        deck: currentSlide.deck.filter((canvas) => canvas.id === currentCanvas),
      };

      renderCanvasContent(canvasInstance.current, updatedSlide.deck[0].content,800,600); 

      canvasInstance.current.on('object:modified', handleObjectModified);
      
      return () => {
        canvasInstance.current.dispose();
      };
    }
  }, [currentCanvas, currentSlide]);

  return (
    <div className="main-container">
      <div className="scrollable-column">
        <div className="canvas-list" key={JSON.stringify(slides)}>
          {currentSlide?.deck.map((canvas, index) => (
            <DraggableCanvas
              key={canvas.id}
              index={index}
              canvas={canvas}
              moveCanvas={moveCanvas}
              setCurrentCanvas={setCurrentCanvas}
              deleteCanvas={deleteCanvas}
            />
          ))}
        </div>
        <button onClick={addCanvasToDeck}>Add Slide</button>
      </div>

      <div className="canvas-container">
        {currentCanvas && (
          <div>
            <div onClick={handleCanvasClick}>
              <canvas
                id="canvas"
                ref={canvasRef}
              ></canvas>
            </div>
            <div className="canvas-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <input
                type="color"
                value={backgroundColor}
                onChange={handleColorChange}
                style={{ cursor: 'pointer' }}
              />
              <Icon
                icon="humbleicons:text"
                width="24"
                height="24"
                onClick={() => setToggleMode('text')}
                style={{
                  cursor: 'pointer',
                  backgroundColor: toggleMode === 'text' ? '#e0e0e0' : '#fff',
                  padding: '5px',
                  borderRadius: '50%',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideManager;
