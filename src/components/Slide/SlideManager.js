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
  const [selectedContent, setSelectedContent] = useState([]);
const updateSlideData = (updatedSlide) => {

  const updatedSlideWithDate = {
    ...updatedSlide,
    lastUpdated: Date.now(),
  };

  const updatedSlides = slides.map((slide) =>
    slide.id === updatedSlideWithDate.id ? updatedSlideWithDate : slide
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

  const handleBackgroundColorChange = (event) => {
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
  console.log(object);
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
                      color: object.fill || 'black',
                      scaleX: object.scaleX,
                      scaleY: object.scaleY,
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

    if (toggleMode === 'text')
    {
    // Append the new text object to the content of the canvas
    const newTextObject = {
      type: 'text',
      id: Date.now(),
      text: 'New Text', // Placeholder text
      x: xPercentage,  // Position as percentage
      y: yPercentage,  // Position as percentage
      fontSize: selectedContent?.size || 12,   
      fill: selectedContent?.color || '#000000',
    };
    currentCanvasData.content.push(newTextObject);
    }
        if (toggleMode === 'circle')
    {
    const newCircle = {
      type: 'circle',
      id: Date.now(),
      x: xPercentage,  
      y: yPercentage, 
     radius: selectedContent?.size || 12,   
     fill: selectedContent?.color || '#000000',
    };
    currentCanvasData.content.push(newCircle);
    }
        if (toggleMode === 'square')
    {
    // Append the new text object to the content of the canvas
    const newSquare = {
      type: 'square',
      id: Date.now(),
      x: xPercentage,  
      y: yPercentage, 
      height:  selectedContent?.size || 12,  
      width: selectedContent?.size || 12,
      fill: selectedContent?.color || '#000000',
    };
    currentCanvasData.content.push(newSquare);
    }
    if (toggleMode === 'triangle')
    {
    // Append the new text object to the content of the canvas
    const newTriangle = {
      type: 'triangle',
      id: Date.now(),
      x: xPercentage,  
      y: yPercentage, 
      height:  selectedContent?.size || 12,  
      width: selectedContent?.size || 12,
      fill: selectedContent?.color || '#000000',
    };
    currentCanvasData.content.push(newTriangle);
    }
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
      canvasInstance.current.on('selection:created', (e) => {
      const selectedObjects =  canvasInstance.current.getActiveObjects();
      console.log(selectedObjects);
      if (selectedObjects) {
        setSelectedContent(selectedObjects[0]);
        console.log(selectedContent.fill);
      }
    });
      return () => {
        canvasInstance.current.dispose();
      };
    }
  }, [currentCanvas, currentSlide]);

  
  // Handle color change
  const handleColorChange = (event) => {

    const newColor = event.target.value;

    if (selectedContent && selectedContent.id) {
      const updatedSlide = {
        ...currentSlide,
        deck: currentSlide.deck.map((canvas) => {
          if (canvas.id === currentCanvas) {
            return {
              ...canvas,
              content: canvas.content.map((item) =>
                item.id === selectedContent.id ? { ...item, fill: newColor } : item
              ),
            };
          }
          return canvas;
        }),
      };
      setCurrentSlide(updatedSlide);
      updateSlideData(updatedSlide);
    }
    setSelectedContent((prevContent) => ({ ...prevContent, fill: newColor }));
  };

  // Handle fontSize or radius change
  const handleSizeChange = (event) => {
    const newSize = event.target.value;
    if (selectedContent && selectedContent.id) {
      const updatedSlide = {
        ...currentSlide,
        deck: currentSlide.deck.map((canvas) => {
          if (canvas.id === currentCanvas) {
            return {
              ...canvas,
              content: canvas.content.map((item) =>
                item.id === selectedContent.id
                  ? {
                      ...item,
                      fontSize: item.type === 'text' ? newSize : item.fontSize,
                      radius: item.type === 'circle' ? newSize : item.radius,
                    }
                  : item
              ),
            };
          }
          return canvas;
        }),
      };
      setCurrentSlide(updatedSlide);
      updateSlideData(updatedSlide);
    }
    setSelectedContent((prevContent) => ({
      ...prevContent,
      fontSize: prevContent.type === 'text' ? newSize : prevContent.fontSize,
      radius: prevContent.type === 'circle' ? newSize : prevContent.radius,
    }));
  };
  useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' && selectedContent?.id) {
      event.preventDefault();

      const updatedSlide = {
        ...currentSlide,
        deck: currentSlide.deck.map((canvas) => {
          if (canvas.id === currentCanvas) {
            return {
              ...canvas,
              content: canvas.content.filter((item) => item.id !== selectedContent.id),
            };
          }
          return canvas;
        }),
      };

      setCurrentSlide(updatedSlide);
      updateSlideData(updatedSlide);
      setSelectedContent(null); // Clear selection after deletion
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [selectedContent, currentCanvas, currentSlide]);

const copyCanvas = (canvasId) => {
  const canvasToCopy = currentSlide.deck.find((canvas) => canvas.id === canvasId);

  if (!canvasToCopy) {
    console.error('Canvas not found');
    return;
  }

  const copiedCanvas = {
    ...canvasToCopy,
    id: Date.now(), // Assign a new unique ID
  };

  const updatedSlide = {
    ...currentSlide,
    deck: [...currentSlide.deck, copiedCanvas],
  };

  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide);
};


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
              copyCanvas={copyCanvas}
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
         <div className="canvas-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Icon icon="material-symbols-light:background-grid-small-sharp" width="24" height="24" style={{ marginRight: '5px' }} />
    <label htmlFor="background-color" style={{ marginRight: '10px' }}>Background Color:</label>
    <input
      id="background-color"
      type="color"
      value={backgroundColor}
      onChange={handleBackgroundColorChange}
      style={{ cursor: 'pointer' }}
    />
  </div>

  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Icon icon="mdi:shape" width="24" height="24" style={{ marginRight: '5px' }} />
    <label htmlFor="content-color" style={{ marginRight: '10px' }}>Content Color:</label>
    <input
      id="content-color"
      type="color"
      key={selectedContent?.fill || '000000'}
      value={selectedContent?.fill || '000000'}
      onChange={handleColorChange}
      style={{ cursor: 'pointer' }}
    />
  </div>

  <div style={{ display: 'flex', alignItems: 'center' }}>
    <label htmlFor="size-range" style={{ marginRight: '10px' }}>Content Size:</label>
    <input
      id="size-range"
      type="range"
      min="1"
      max="100"
      value={selectedContent?.fontSize || selectedContent?.radius || 12}
      onChange={handleSizeChange}
      style={{ width: '100px' }}
    />
  </div>

  <div style={{ display: 'flex', alignItems: 'center' }}>
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
        marginLeft: '10px',
      }}
    />
    <Icon
      icon="material-symbols:circle"
      width="24"
      height="24"
      onClick={() => setToggleMode('circle')}
      style={{
        cursor: 'pointer',
        backgroundColor: toggleMode === 'circle' ? '#e0e0e0' : '#fff',
        padding: '5px',
        borderRadius: '50%',
        marginLeft: '10px',
      }}
    />
    <Icon
      icon="material-symbols:square"
      width="24"
      height="24"
      onClick={() => setToggleMode('square')}
      style={{
        cursor: 'pointer',
        backgroundColor: toggleMode === 'square' ? '#e0e0e0' : '#fff',
        padding: '5px',
        borderRadius: '50%',
        marginLeft: '10px',
      }}
    />
       <Icon
      icon="mdi:triangle"
      width="24"
      height="24"
      onClick={() => setToggleMode('triangle')}
      style={{
        cursor: 'pointer',
        backgroundColor: toggleMode === 'triangle' ? '#e0e0e0' : '#fff',
        padding: '5px',
        borderRadius: '50%',
        marginLeft: '10px',
      }}
    />
  </div>
</div>
</div>
        )}
      </div>
    </div>
  );
}

export default SlideManager;
