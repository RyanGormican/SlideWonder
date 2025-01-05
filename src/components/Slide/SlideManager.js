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
  const contentType = getSelectedContentType(object.id); // Get the content type

  // Declare width and height with let so they can be reassigned
  let width = object.width ? (object.width / 800) * 100 : 1;
  let height = object.height ? (object.height / 600) * 100 : 1;

  // If the content type is square, set width and height to the minimum of the two
  if (contentType === 'square') {
    const minDimension = Math.min(width, height);
    width = height = minDimension; // Make height and width equal
  }

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
                      x: (object.left / 800) * 100,
                      y: (object.top / 600) * 100,
                      width: width,
                      radius: object.radius ? (object.radius / Math.min(800, 600)) * 100 : 1,
                      height: height,
                      angle: object.angle,
                      text: object.textLines ? object.textLines[0] : item.text,
                      fontSize: object.fontSize ? (object.fontSize / Math.min(800, 600)) * 100 : 12,
                      color: object.fill || 'black',
                      scaleX: object.scaleX || 1,
                      scaleY: object.scaleY || 1,
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
  const xPercentage = (event.nativeEvent.offsetX / canvasWidth) * 100;
  const yPercentage = (event.nativeEvent.offsetY / canvasHeight) * 100;

  const updatedSlide = { ...currentSlide };
  const currentCanvasData = updatedSlide.deck.find((canvas) => canvas.id === currentCanvas);

  if (!currentCanvasData) {
    console.error("Canvas with id", currentCanvas, "not found.");
    return;
  }

  // Initialize content if it is null
  currentCanvasData.content = currentCanvasData.content || [];

  const createNewObject = (type, additionalProperties) => ({
    type,
    id: Date.now(),
    x: xPercentage,
    y: yPercentage,
    fill: selectedContent?.fill || '#000000',
    ...additionalProperties,
  });

  if (toggleMode === 'text') {
    const newTextObject = createNewObject('text', {
      text: 'New Text',
      fontSize: selectedContent?.fontSize || 12,
    });
    currentCanvasData.content.push(newTextObject);
  } 

  if (toggleMode === 'circle') {
    const newCircle = createNewObject('circle', {
      radius: selectedContent?.radius ? (selectedContent?.radius / canvasWidth) * 100 : 12,
    });
    currentCanvasData.content.push(newCircle);
  }

  if (toggleMode === 'square') {
    const newSquare = createNewObject('square', {
      width: selectedContent?.width ? (selectedContent?.width / canvasWidth) * 100 : 12,
      height: selectedContent?.height ? (selectedContent?.height / canvasHeight) * 100 : 12,
    });
    currentCanvasData.content.push(newSquare);
  }

  if (toggleMode === 'triangle') {
    const newTriangle = createNewObject('triangle', {
      width: selectedContent?.size ? (selectedContent?.size / canvasWidth) * 100 : 12,
      height: selectedContent?.size ? (selectedContent?.size / canvasHeight) * 100 : 12,
    });
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
      if (selectedObjects) {
        setSelectedContent(selectedObjects[0]);
      }
    });
          canvasInstance.current.on('selection:updated', (e) => {
      const selectedObjects =  canvasInstance.current.getActiveObjects();
      if (selectedObjects) {
        setSelectedContent(selectedObjects[0]);
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

    if (selectedContent && selectedContent?.id) {
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

const handleSizeChange = (event) => {
  const newSize = event.target.value;

  if (!selectedContent || !selectedContent.id) return;

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
                  ...getUpdatedProperties(item, newSize),
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

  setSelectedContent((prevContent) => ({
    ...prevContent,
    ...getUpdatedProperties(prevContent, newSize),
  }));
};

const getUpdatedProperties = (item, newSize) => {
  const updatedProps = {};

  // Iterate over all keys of the item and apply newSize where relevant
  Object.keys(item).forEach((key) => {
    if (key === 'fontSize' || key === 'radius' || key === 'height' || key === 'width') {
      updatedProps[key] = newSize;
    }
  });

  return updatedProps;
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

const handleScaleChange = (event, axis) => {
  const newValue = parseFloat(event.target.value);
  const updatedSlide = {
    ...currentSlide,
    deck: currentSlide.deck.map((canvas) => {
      if (canvas.id === currentCanvas) {
        return {
          ...canvas,
          content: canvas.content.map((item) =>
            item.id === selectedContent?.id
              ? {
                  ...item,
                  [axis === 'x' ? 'scaleX' : 'scaleY']: newValue,
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

  setSelectedContent((prevContent) => ({
    ...prevContent,
    [axis === 'x' ? 'scaleX' : 'scaleY']: newValue,
  }));
};
const getSelectedContentType = (selectedContentId) => {
  if (!selectedContentId) return null;  // Ensure selectedContentId is valid

  const currentCanvasData = currentSlide?.deck.find((canvas) => canvas.id === currentCanvas);
  if (!currentCanvasData || !currentCanvasData.content) return null;  // Return null if canvas or content is not found

  // Find the selected content item in the content array
  const selectedContentItem = currentCanvasData.content.find((item) => item.id === selectedContentId);
  // Return the .type of the selected content item (if found)
  return selectedContentItem ? selectedContentItem.type : null;
};



const getSizeValue = (selectedContent) => {
  const contentType = getSelectedContentType(selectedContent.id);
  switch(contentType) {
    case 'text':
      return selectedContent?.fontSize || 12;
    case 'circle':
      return selectedContent?.radius || 12;
    case 'triangle':
    case 'square':
      return selectedContent?.height || 12;
    default:
      return 12;
  }
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
          <div
            className="canvas-controls"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon
                icon="material-symbols-light:background-grid-small-sharp"
                width="24"
                height="24"
                style={{ marginRight: '5px' }}
              />
              <label htmlFor="background-color" style={{ marginRight: '10px' }}>
                Background Color:
              </label>
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
              <label htmlFor="content-color" style={{ marginRight: '10px' }}>
                Content Color:
              </label>
              <input
                id="content-color"
                type="color"
                key={selectedContent?.fill || '000000'}
                value={selectedContent?.fill || '000000'}
                onChange={handleColorChange}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="x-scale-range" style={{ marginRight: '10px' }}>
                  X Scale:
                </label>
                <input
                  id="x-scale-range"
                  type="range"
                  min="1"
                  max="100"
                  value={selectedContent?.scaleX || 1}
                   onChange={(e) => handleScaleChange(e, 'x')}
                  style={{ width: '100px' }}
                />
                <input
                  type="number"
                  value={selectedContent?.scaleX || 1}
                 onChange={(e) => handleScaleChange(e, 'x')}
                  style={{ width: '50px', marginLeft: '10px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="y-scale-range" style={{ marginRight: '10px' }}>
                  Y Scale:
                </label>
                <input
                  id="y-scale-range"
                  type="range"
                  min="1"
                  max="100"
                  value={selectedContent?.scaleY || 1}
                    onChange={(e) => handleScaleChange(e, 'y')}
                  style={{ width: '100px' }}
                />
                <input
                  type="number"
                  value={selectedContent?.scaleY || 1}
           onChange={(e) => handleScaleChange(e, 'y')}
                  style={{ width: '50px', marginLeft: '10px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <label htmlFor="size-range" style={{ marginRight: '10px' }}>
                  Content Size:
                </label>
<input
  id="size-range"
  type="range"
  min="1"
  max="100"
  value={getSizeValue(selectedContent)}
  onChange={handleSizeChange}
  style={{ width: '100px' }}
/>
<input
  type="number"
  value={getSizeValue(selectedContent)}
  onChange={handleSizeChange}
  style={{ width: '50px', marginLeft: '10px' }}
/>


              </div>
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
