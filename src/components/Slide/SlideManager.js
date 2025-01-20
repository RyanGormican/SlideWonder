import React, { useState, useEffect, useRef } from 'react';
import { renderCanvasContent } from './CanvasRender'; 
import DraggableCanvas from './DraggableCanvas';
import { Icon } from '@iconify/react';
import { Canvas, IText } from 'fabric';
import { transitions } from './TransitionsList';
import CanvasControls from './CanvasControls'; 
import {handleDragStart, handleDragOver, handleDrop, formatTransition, deleteTransition, updateCanvasDuration} from './TransitionsManagement'; 
import {copyCanvas} from './CanvasManagement'; 
import {saveSlideToLocalStorage} from '../Helper'
function SlideManager({ slides, setSlides, currentSlide, setCurrentSlide,pins }) {
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [toggleMode, setToggleMode] = useState(null);
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const [selectedContent, setSelectedContent] = useState([]);
  const [copiedContent, setCopiedContent] = useState(null);

const updateSlideData = (updatedSlide) => {

  const updatedSlideWithDate = {
    ...updatedSlide,
    lastUpdated: Date.now(),
  };

  const updatedSlides = slides.map((slide) =>
    slide.id === updatedSlideWithDate.id ? updatedSlideWithDate : slide
  );

  setSlides(updatedSlides);
  saveSlideToLocalStorage(updatedSlides,1,1);
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
const copyCanvasElement = () => {
  if (!selectedContent) return; // If nothing is selected, do nothing
  setCopiedContent(selectedContent); // Copy the selected content
};

const pasteCanvas = () => {
  if (!copiedContent) return; // If no content to paste, do nothing

  // Clone the copied content and place it at a new position 
  const newContent = {
    type: getSelectedContentType(selectedContent.id),
    id: Date.now(), 
    x: copiedContent.left + 5, 
    y: copiedContent.top + 5,
    width:  copiedContent.width, 
    radius: copiedContent.radius,
    height:  copiedContent.height, 
    angle: copiedContent.angle,
    text: copiedContent.textLines, 
    fontSize: copiedContent.fontSize, 
    fill: selectedContent.fill,
    scaleX: copiedContent.scaleX,
    scaleY: copiedContent.scaleY,
  };
 
  // Add the new content to the current canvas
  const updatedSlide = {
    ...currentSlide,
    deck: currentSlide.deck.map((canvas) => {
      if (canvas.id === currentCanvas) {
        return {
          ...canvas,
          content: [...canvas.content, newContent], // Add new content to the canvas
        };
      }
      return canvas;
    }),
  };

  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide); // Update the slide data
};


const handleObjectModified = (e) => {

  const object = e.target;
  const contentType = getSelectedContentType(object.id); // Get the content type
  
  // Declare width and height with let so they can be reassigned
  let width = object.width ? (object.width ) * 1 : 1;
  let height = object.height ? (object.height) * 1 : 1;

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
          content: canvas?.content
            ? canvas?.content.map((item) =>
                item.id === object.id
                  ? {
                      ...item,
                      x: object.left,
                      y: object.top,
                      width:  object.width ? (object.width ) * 1 : 1,
                      radius: object.radius ? (object.radius ) * 1 : 1,
                      height:  object.height ? (object.height ) * 1 : 1,
                      angle: object.angle,
                      text: object.textLines ? object.textLines[0] : item.text,
                      fontSize: object.fontSize ? (object.fontSize) * 1 : 12,
                      fill: object.fill || '#FFFFFF',
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

  const updatedSlide = {
    ...currentSlide,
    deck: currentSlide.deck.map((canvas) => {
      if (canvas.id === currentCanvas) {
        const currentCanvasData = { ...canvas }; // Copy canvas data

        // Initialize content if it is null
        currentCanvasData.content = currentCanvasData.content || [];


        const contentSize = Math.max(
    selectedContent?.fontSize || 12,
    selectedContent?.radius || 12,
    selectedContent?.width ||12,
    selectedContent?.height || 12
  );
        const createNewObject = (type, additionalProperties) => ({
          type,
          id: Date.now(),
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
          fill: selectedContent?.fill || '#000000',
          fontSize: contentSize,
    radius: contentSize,
    width: contentSize,
    height: contentSize,
          ...additionalProperties,
        });

        if (toggleMode === 'text') {
          const newTextObject = createNewObject('text', { text: 'New Text' });
          currentCanvasData.content = [...currentCanvasData.content, newTextObject];
        }

        if (toggleMode === 'circle') {
          const newCircle = createNewObject('circle', { radius: selectedContent?.radius || 12 });
          currentCanvasData.content = [...currentCanvasData.content, newCircle];
        }

        if (toggleMode === 'square') {
          const newSquare = createNewObject('square', {
            width: selectedContent?.width || 12,
            height: selectedContent?.height || 12,
          });
          currentCanvasData.content = [...currentCanvasData.content, newSquare];
        }

        if (toggleMode === 'triangle') {
          const newTriangle = createNewObject('triangle', {
            width: selectedContent?.size || 12,
            height: selectedContent?.size || 12,
          });
          currentCanvasData.content = [...currentCanvasData.content, newTriangle];
        }
         if (toggleMode === 'image') {
          const newImage = createNewObject('image', { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvk-ecPeKuRvec5czcoK2H7axiY9XZtcqopQ&s' });
          currentCanvasData.content = [...currentCanvasData.content, newImage];
        }
        return currentCanvasData;
      }
      return canvas;
    }),
  };

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

      renderCanvasContent(canvasInstance.current, updatedSlide.deck[0]?.content,800,600,1); 

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
        deck: currentSlide?.deck?.map((canvas) => {
          if (canvas.id === currentCanvas) {
            return {
              ...canvas,
              content: canvas?.content?.map((item) =>
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
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'c') {
        event.preventDefault(); 
        copyCanvasElement();
      } else if (event.key === 'v') {
        event.preventDefault(); 
        pasteCanvas();
      }
    }
    if (event.key === 'Backspace' && selectedContent?.id && selectedContent?.type != 'i-text') {
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
}, [selectedContent, copiedContent, currentCanvas, currentSlide]);


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
  const contentType = getSelectedContentType(selectedContent?.id);
  switch(contentType) {
    case 'text':
      return (selectedContent?.fontSize) * 1 || 12;
    case 'circle':
      return (selectedContent?.radius ) * 1 || 12;
    case 'triangle':
    case 'square':
      return (selectedContent?.height) * 1|| 12;
    default:
      return 12;
  }
};

 const sortedTransitions = [...transitions].sort((a, b) => a.title.localeCompare(b.title));
return (
    <div className="main-container">
      <div className="transition-panel">
        <h3>Transitions</h3>
        <div className="transition-list">
          {sortedTransitions.map((transition) => (
            <div
              key={transition.id}
              className="transition-type"
              draggable
              onDragStart={(e) => handleDragStart(e, transition.id)}
            >
              {transition.title}
            </div>
          ))}
        </div>
      </div>
      
      <div className="scrollable-column">
        <div className="canvas-list" key={JSON.stringify(currentSlide?.deck)}>
          {currentSlide?.deck.map((canvas, index) => (
            <React.Fragment key={canvas.id}>
              <div>
                <DraggableCanvas
                  index={index}
                  canvas={canvas}
                  moveCanvas={moveCanvas}
                  setCurrentCanvas={setCurrentCanvas}
                  deleteCanvas={deleteCanvas}
                  currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide}
                  copyCanvas={copyCanvas}
                  updateSlideData={updateSlideData}
                />
              </div>
          {index < currentSlide.deck.length - 1 && (
  <div
    className="canvas-transition-overlay"
    onDragOver={handleDragOver}
    onDrop={(e) => handleDrop(e, canvas.id, currentSlide, setCurrentSlide, updateSlideData)}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '3vh',
      backgroundColor: 'darkgrey',
      borderRadius: '8px',
    }}
  >
    {/* Transition Label */}
    <span style={{ flexGrow: 0, textAlign: 'left', paddingLeft: '10px' }}>
      {canvas.transition ? formatTransition(canvas.transition, transitions) : null}
    </span>

    {/* Duration Section with Input and Range */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
      <span style={{ display: canvas.transition ? 'inline-block' : 'none' }}>
      <input
        type="number"
        min="0.1"
        max="12"
        step="0.1"
        value={canvas.duration}
        onChange={(e) => updateCanvasDuration(e, canvas.id, currentSlide, setCurrentSlide, updateSlideData)}
        style={{
          width: '60px',
          display: canvas.transition ? 'inline-block' : 'none',
          textAlign: 'center',
          backgroundColor: 'darkgrey',
          border: 'none',
          outline: 'none',
        }}
      />s
      </span>
    
      
      {/* Range Input for Duration */}
      <input
        type="range"
        min="0.1"
        max="12"
        step="0.1"
        value={canvas.duration}
        onChange={(e) => updateCanvasDuration(e, canvas.id, currentSlide, setCurrentSlide, updateSlideData)}
        style={{
          width: '100px',
          display: canvas.transition ? 'inline-block' : 'none',
        }}
      />
    </div>

    {/* Trash Icon */}
    <Icon
      icon="mdi:trash"
      width="16"
      height="16"
      className="delete-icon"
      onClick={() => deleteTransition(canvas.id, currentSlide, setCurrentSlide, updateSlideData)}
      style={{
        color: 'red',
        cursor: 'pointer',
        background: '#fff',
        borderRadius: '50%',
        padding: '4px',
        border: '1px solid #ccc',
        display: canvas.transition ? 'inline-block' : 'none',
      }}
    />
  </div>
)}


            </React.Fragment>
          ))}
        </div>
        <button onClick={addCanvasToDeck}>Add Slide</button>
      </div>
        {currentCanvas && (
      <div className="canvas-container">
          <div>
            <div onClick={handleCanvasClick}>
              <canvas id="canvas" ref={canvasRef}></canvas>
            </div>
            <CanvasControls
              backgroundColor={backgroundColor}
              selectedContent={selectedContent}
              handleBackgroundColorChange={handleBackgroundColorChange}
              handleColorChange={handleColorChange}
              handleScaleChange={handleScaleChange}
              handleSizeChange={handleSizeChange}
              getSizeValue={getSizeValue}
              setToggleMode={setToggleMode}
              toggleMode={toggleMode}
            />
          </div>
       </div>
        )}

    </div>
  );
};


export default SlideManager;
