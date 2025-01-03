import React, { useState, useEffect } from 'react';
import DraggableCanvas from './DraggableCanvas';

function SlideManager({ slides, setSlides, currentSlide, setCurrentSlide }) {
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

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
      content: null,
      backgroundColor: '#ffffff',
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
   useEffect(() => {
   setBackgroundColor( currentSlide?.deck.find((canvas) => canvas.id === currentCanvas)?.backgroundColor || '#ffffff');
  }, [currentCanvas]);
  return (
    <div className="main-container">
      <div className="scrollable-column">
        <div className="canvas-list">
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
            <canvas
              id="fabric-canvas"
              width="800"
              height="600"
              style={{
                backgroundColor:
                  currentSlide?.deck.find((canvas) => canvas.id === currentCanvas)
                    ?.backgroundColor || '#ffffff',
              }}
            ></canvas>
            <div
              className="canvas-controls"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
              }}
            >
              <input
                type="color"
                value={backgroundColor}
                onChange={handleColorChange}
                style={{ cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideManager;
