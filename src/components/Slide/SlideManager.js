import React, { useState, useEffect, useRef } from 'react';
import { renderCanvasContent } from './CanvasRender'; 
import DraggableCanvas from './DraggableCanvas';
import { Icon } from '@iconify/react';
import { Canvas, IText } from 'fabric';
import { transitions } from './TransitionsList';
import { templates } from './TemplatesList';
import CanvasControls from './CanvasControls'; 
import {handleDragStart, handleDragOver, handleDrop, formatTransition, deleteTransition, updateCanvasDuration} from './TransitionsManagement'; 
import {handleObjectModified} from './Modifications';
import { IconButton } from '@mui/material';
import {handleCanvasClick, copyCanvasElement, copyCanvas} from './CanvasManagement'; 
import { saveSlideToLocalStorage} from '../Helper'
function SlideManager({ slides, setSlides, currentSlide, setCurrentSlide,pins }) {
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [toggleMode, setToggleMode] = useState(null);
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const [selectedContent, setSelectedContent] = useState([]);
  const [copiedContent, setCopiedContent] = useState(null);
  const [additionsMode, setAdditionsMode] = useState('transitions');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const templatesRef = useRef({}); 
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

 const sortedTemplates = [...templates].sort((a, b) => a.title.localeCompare(b.title));
    useEffect(() => {
    const loadTemplates = () => {
      // Iterate over templates using forEach
      templates.forEach((template) => {
        const { id, title } = template; // Destructure id from template
        const canvasElement = templatesRef.current[id]; // Access the canvas ref by id
        loadTemplate(`${id}.js`).then((canvasTemplate) => {
          if (canvasTemplate) {
            const { content, backgroundColor } = canvasTemplate;

            // Create a new canvas
            const newCanvas = new Canvas(canvasElement, {
              width: 150,
              height: 150,
              preserveObjectStacking: true,
              backgroundColor: backgroundColor || '#ffffff', 
            });

            // Render the content on the canvas
            renderCanvasContent(newCanvas, content, 150, 150, 1);
          }
        }).catch((error) => {
          console.error('Error loading template:', error);
        });
      });
    };

    loadTemplates(); 

    // Cleanup function to dispose of the fabric canvas instances when component unmounts or data changes
    return () => {
      // Loop through each canvas reference by keys in templatesRef.current
      Object.values(templatesRef.current).forEach((canvasElement) => {
        if (canvasElement) {
          const fabricCanvas = canvasElement.fabricCanvas;
          if (fabricCanvas) {
            fabricCanvas.dispose(); // Dispose of the canvas when cleaning up
          }
        }
      });
    };
  }, [additionsMode]); 

  // Function to dynamically import the template content
  const loadTemplate = (templateTitle) => {
    return import(`./Templates/${templateTitle}`)
      .then((template) => template.default) 
      .catch((error) => {
        console.error('Error loading template:', error);
        return null; // Return null if there is an error
      });
  };

const addCanvasToDeck = async () => {
  if (!currentSlide) {
    alert('Please select a slide first!');
    return;
  }

  // Initialize content and backgroundColor with defaults
  let content = null;
  let backgroundColor = '#ffffff';

  if (selectedTemplate) {
    // If there's a selected template, load the content and background color from it
    const canvasTemplate = await loadTemplate(selectedTemplate.id);
    if (canvasTemplate) {
      content = canvasTemplate.content || null;
      backgroundColor = canvasTemplate.backgroundColor || '#ffffff';
    }
  }
  const newCanvas = {
    id: Date.now(),
    content: content,
    backgroundColor: backgroundColor,
    text: '', 
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


const pasteCanvas = () => {
  if (!copiedContent ||  Array.isArray(copiedContent) && copiedContent.length === 0 ||   typeof copiedContent === 'string') return; 

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
canvasInstance.current.on('object:modified', (e) => handleObjectModified(e, getSelectedContentType, currentSlide, currentCanvas, setCurrentSlide, updateSlideData));

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
        copyCanvasElement(selectedContent,setCopiedContent);
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
      <div className="additions-panel">
      <IconButton onClick={() => setAdditionsMode("transitions")}>
        <h3>Transitions <Icon icon="fluent-mdl2:transition-pop" width="24" height="24" /> </h3>
    </IconButton>
         <IconButton  onClick={() => setAdditionsMode("templates")}>
        <h3>Templates <Icon icon="ion:easel" width="24" height="24" /></h3>
    </IconButton>
      {additionsMode === "transitions" ? (
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
        ) : ( <div>   {sortedTemplates.map((template) => (
           <div
              key={template.id}
               onClick={() => setSelectedTemplate(selectedTemplate === template ? null : template)} 
        style={{
          backgroundColor: selectedTemplate === template ? '#e0e0e0' : 'transparent', 
          padding: '10px',
          margin: '5px',
          cursor: 'pointer',
        }}
            >         <div className="locked">
                <canvas ref={(el) => (templatesRef.current[template.id] = el)}></canvas>
                </div>
              {template.title}
            </div>
        
        ))}
        </div>)}
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
             <div onClick={(e) => handleCanvasClick(e, toggleMode, setToggleMode, currentSlide, setCurrentSlide, currentCanvas, selectedContent, updateSlideData)}>
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
