import React, { useState, useEffect, useRef } from 'react';
import { renderCanvasContent } from './Canvas/CanvasRender'; 
import DraggableCanvas from './Canvas/DraggableCanvas';
import { Icon } from '@iconify/react';
import { Canvas, IText } from 'fabric';
import { transitions } from './TransitionsList';
import { templates } from './TemplatesList';
import Template from './Template';
import CanvasControlElements from './Canvas/CanvasControls/CanvasControlElements'; 
import CanvasControlShapes from './Canvas/CanvasControls/CanvasControlShapes'; 
import CanvasControlColors from './Canvas/CanvasControls/CanvasControlColors'; 
import CanvasControlTools from './Canvas/CanvasControls/CanvasControlTools'; 
import {handleDragStart, handleDragOver, handleDrop, formatTransition, deleteTransition, updateCanvasDuration} from './TransitionsManagement'; 
import {handleObjectModified} from './Modifications';
import { Card, CardMedia, Menu, MenuItem, FormControl, Select, InputLabel, CardContent, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import {handleCanvasClick, copyCanvasElement, copyCanvas} from './Canvas/CanvasManagement'; 
import { saveSlideToLocalStorage} from '../Helper'
function SlideManager({ slides, setSlides, currentSlide, setCurrentSlide,personalTemplates, setPersonalTemplates,modulars }) {
  const [currentCanvas, setCurrentCanvas] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [toggleMode, setToggleMode] = useState(null);
  const [canvasMode, setCanvasMode] = useState('shapes');
  const [eyedropper, setEyedropper]=useState(false);
  const [paintbrush, setPaintbrush] = useState(false);
  const [gridLines, setGridLines] = useState(false);
  const [gridSnap, setGridSnap] = useState(false)
  const [points,setPoints] =useState([]);
  const [connectionPoint, setConnectionPoint] = useState(false);
  const canvasRef = useRef(null);
  const canvasInstance = useRef(null);
  const [selectedContent, setSelectedContent] = useState([]);
  const [copiedContent, setCopiedContent] = useState(null);
  const [additionsMode, setAdditionsMode] = useState('transitions');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [contentLock,setContentLock] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Default'); 
  const handleAccordionToggle = (accordionId) => {
    setExpandedAccordion(expandedAccordion === accordionId ? null : accordionId);
  };
  const templatesRef = useRef({}); 
  const [selectedProperties, setSelectedProperties] = useState({
  fill: null,
  scaleX: 1,
  scaleY: 1,
  size: 12,
  x: 0,
  y: 0,
  opacity:1,
});
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
useEffect(() => { handleCanvasClick({ target: { width: 500, height: 500 }, nativeEvent: { offsetX: 100, offsetY: 150 } }, toggleMode, setToggleMode, currentSlide, setCurrentSlide, currentCanvas, selectedContent, updateSlideData, selectedProperties, points, setPoints, connectionPoint, setConnectionPoint); }, [connectionPoint]);

useEffect(() => {
 if (toggleMode !== 'polygon') {
    setPoints([]);
  }
},[toggleMode]);
  useEffect(() => {
  const loadTemplates = () => {
    // Iterate over templates using forEach
    templates.forEach((template) => {
      const { id, title } = template; // Destructure id from template
      const canvasElement = templatesRef.current[id]; // Access the canvas ref by id
      
      loadTemplate(`${id}.js`).then((canvasTemplate) => {
        if (canvasTemplate) {
          const { content, backgroundColor } = canvasTemplate;

          // Check if the canvas already exists, and dispose of it if it does
          const existingCanvas = canvasElement.fabricCanvas;
          if (existingCanvas) {
            existingCanvas.dispose(); // Dispose of the old canvas
          }

          // Create a new canvas
          const newCanvas = new Canvas(canvasElement, {
            width: 150,
            height: 150,
            preserveObjectStacking: true,
            backgroundColor: backgroundColor || '#ffffff', 
          });

          // Attach the new canvas to the DOM element
          canvasElement.fabricCanvas = newCanvas;

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
}, [additionsMode,activeCategory]);


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
    return;
  }


  let content = null;
  let backgroundColor = '#ffffff';

  if (selectedTemplate) {
    const slideWonderData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
    const personalTemplates = slideWonderData.personaltemplates || [];

    // Check if the selectedTemplate exists in personal templates
    const existingTemplate = personalTemplates.find(template => template.id === selectedTemplate.id);

    if (existingTemplate) {

      content = existingTemplate.content || null;
      backgroundColor = existingTemplate.backgroundColor || '#ffffff';
    } else {

      const canvasTemplate = await loadTemplate(selectedTemplate.id);
      if (canvasTemplate) {
        content = canvasTemplate.content || null;
        backgroundColor = canvasTemplate.backgroundColor || '#ffffff';
      }
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

  const handleBackgroundColorChange = (color) => {
    const newColor = color.hex;
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
  if (!copiedContent ||  Array.isArray(copiedContent) && copiedContent?.length === 0 ||   typeof copiedContent === 'string') return; 
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
    text: copiedContent.textLines?.join(' '), 
    fontSize: copiedContent.fontSize, 
    fill: selectedContent.fill,
    scaleX: copiedContent.scaleX,
    scaleY: copiedContent.scaleY,
    opacity:copiedContent.opacity,
    stroke: copiedContent.stroke || null,
    strokeWidth: copiedContent.strokeWidth || 1,
    points: copiedContent.points || [],
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


const buttonStyles = {
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '5px',
};

const buttons = [
  { mode: 'shapes', icon: 'fluent-mdl2:shape-solid' },
  { mode: 'elements', icon: 'mdi:ruler' },
  { mode: 'colors', icon: 'mdi:paintbrush' },
  { mode: 'tools', icon: 'mdi:wrench' },
];

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

    renderCanvasContent(canvasInstance.current, updatedSlide.deck[0]?.content, 800, 600, 1); 

    // Event handlers for canvas interactions
    const handleSelection = (e) => {

      const selectedObjects = canvasInstance.current.getActiveObjects();
      if (selectedObjects?.length) {
        setSelectedContent(selectedObjects[0]);
      } else {
        setSelectedContent(null);
      }
    };

    // Handle object modification
    canvasInstance.current.on('object:modified', (e) => {
      handleObjectModified(e, getSelectedContentType, currentSlide, currentCanvas, setCurrentSlide, updateSlideData,gridSnap);
    });

    // Handle selection creation, update, and clearing
    canvasInstance.current.on('selection:created', handleSelection);
    canvasInstance.current.on('selection:updated', handleSelection);
    canvasInstance.current.on('selection:cleared', () => setSelectedContent(null));

    // Cleanup on component unmount or dependencies change
    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
      }
    };
  }
}, [currentCanvas, currentSlide]);


 const updateProperty = (property, newValue) => {
  setSelectedProperties((prevProperties) => {
    const updatedProperties = {
      ...prevProperties,
      [property]: newValue,
    };

    const updatedSlide = {
      ...currentSlide,
      deck: currentSlide.deck.map((canvas) => {
        if (canvas.id === currentCanvas) {

          if (property === 'backgroundColor') {
            return {
              ...canvas,
              backgroundColor: newValue, 
            };
          }

      
          return {
            ...canvas,
            content: canvas.content.map((item) => {
              if (item.id === selectedContent?.id) {
                // Apply specific changes based on the property
                if (property === 'size') {
                  if (getSelectedContentType(selectedContent.id) === 'circle') {
                    return { ...item, radius: newValue };
                  } else if (getSelectedContentType(selectedContent.id) === 'text') {
                    return { ...item, fontSize: newValue };
                  } else {
                    return { ...item, width: newValue };
                  }
                }
                return { ...item, [property]: newValue };
              }
              return item;
            }),
          };
        }
        return canvas;
      }),
    };

    setCurrentSlide(updatedSlide);
    updateSlideData(updatedSlide);

    return updatedProperties;
  });
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
 
 if (eyedropper && selectedContent) {
    setSelectedProperties((prevProperties) => ({
      ...prevProperties,
      fill: selectedContent.fill, 
    }));
    setEyedropper(false);
  }

   if (paintbrush && selectedContent) {
      const color = selectedProperties?.fill || '#000000';
      updateProperty('fill', color.hex);
      setSelectedContent(null);
    }

if (!contentLock && selectedContent){

    const { type, id, fill, fontSize, radius, height, width, scaleX, scaleY,opacity, left, top, stroke, strokeWidth} = selectedContent;
   const size = fontSize || Math.max(
    ...( [radius, height, width].filter(value => value !== undefined && value !== null) )
  ) || 12;
    setSelectedProperties({
      type,
      id,
      fill,
      fontSize: fontSize || 12,  
      radius: radius || 12,  
      height: height || 12,  
      width: width || 12,    
      scaleX: scaleX || 1,   
      scaleY: scaleY || 1,   
      size: size || 12,
      opacity: opacity || 1,
      x: left || 1,
      y: top || 1,
      stroke: stroke || null,
      strokeWidth: strokeWidth || 1,
    });
  }
},[selectedContent]);

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


const getSelectedContentType = (selectedContentId) => {
  if (!selectedContentId) return null;  // Ensure selectedContentId is valid

  const currentCanvasData = currentSlide?.deck.find((canvas) => canvas.id === currentCanvas);
  if (!currentCanvasData || !currentCanvasData.content) return null;  // Return null if canvas or content is not found

  // Find the selected content item in the content array
  const selectedContentItem = currentCanvasData.content.find((item) => item.id === selectedContentId);
  // Return the .type of the selected content item (if found)
  return selectedContentItem ? selectedContentItem.type : null;
};


 const handleModularSelection = (e, canvasId, currentSlide, setCurrentSlide, updateSlideData) => {
  const selectedModularId = e.target.value;

  // Update the deck with the selected modular id
  const updatedDeck = currentSlide.deck.map((canvas) =>
    canvas.id === canvasId ? { ...canvas, modular: selectedModularId } : canvas
  );

  // Update the current slide with the modified deck
  const updatedSlide = { ...currentSlide, deck: updatedDeck };

  // Update the state and pass the updated slide data to the parent function
  setCurrentSlide(updatedSlide);
  updateSlideData(updatedSlide, 1, 1);
};

const getSizeValue = () => {
  switch (selectedContent?.type) {
    case 'text':
      return selectedProperties.size * 1 || 12;
    case 'circle':
      return selectedProperties.size * 1 || 12;
    case 'triangle':
    case 'square':
      return selectedProperties.size * 1 || 12;
    default:
      return 12;
  }
};

 const sortedTransitions = [...transitions].sort((a, b) => a.title.localeCompare(b.title));
  const timerModulars = modulars?.filter(modular => modular.type === 'timer');
return (

    <div className="main-container">
      <div className="additions-panel">
  <div className="button-container">
  <IconButton onClick={() => setAdditionsMode("transitions")}>
    <h3>Transitions <Icon icon="fluent-mdl2:transition-pop" width="1vw" height="1.5vh" /> </h3>
  </IconButton>
  <IconButton onClick={() => setAdditionsMode("templates")}>
    <h3>Templates <Icon icon="ion:easel" width="1vw" height="1.5vh" /></h3>
  </IconButton>
    <IconButton         style={{display:'none'}} onClick={() => setAdditionsMode("modulars")}>
    <h3>Modulars <Icon icon="material-symbols:interactive-space" width="1vw" height="1.5vh" /></h3>
  </IconButton>
</div>

  
        <div style={{ display: additionsMode === 'transitions' ? 'block' : 'none' }}  className="transition-list">
          {sortedTransitions.map((transition) => (
            <div
              key={transition.id}
              className="transition-type"
              draggable
              onDragStart={(e) => handleDragStart(e, transition.id)}
            >
                   <Accordion style={{backgroundColor: '#e0e0e0',border: '1px solid black', borderBottom: 'none'}}>
                   <AccordionSummary style={{borderBottom: '1px solid black'}}>
              {transition.title}   <Icon icon={transition.icon} height="auto" width="auto"     style={{ marginLeft: 'auto' }}  />
                </AccordionSummary>
                <AccordionDetails>
                <div> {transition.description}</div>
                </AccordionDetails>
                </Accordion>
            </div>
          ))}
        </div>
           <div style={{ display: additionsMode === 'modulars' ? 'block' : 'none' }}  className="transition-list">
   
          {modulars.map((modular) => (
            <div
              key={modular.id}
              className="transition-type"
            >
                   <Accordion style={{backgroundColor: '#e0e0e0',border: '1px solid black', borderBottom: 'none'}}>
                   <AccordionSummary style={{borderBottom: '1px solid black'}}>
              {modular.title}  
                </AccordionSummary>
                <AccordionDetails>
                <div> {modular.type}</div>
                </AccordionDetails>
                </Accordion>
            </div>
          ))}
        </div>
     <div>  
  <div style={{ display: additionsMode === 'templates' ? 'block' : 'none' }} className="template-list">
  <Template
  templates={templates}
  selectedTemplate={selectedTemplate}
  setSelectedTemplate={setSelectedTemplate}
  templatesRef={templatesRef}
  activeCategory={activeCategory}
  setActiveCategory={setActiveCategory}
  personalTemplates={personalTemplates}
  setPersonalTemplates={setPersonalTemplates}
/>
                </div>
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
                  personalTemplates={personalTemplates}
                  setPersonalTemplates={setPersonalTemplates}
                />
              </div>
          {index < currentSlide.deck.length - 1 && (
  <div>
   <div         style={{display:'none'}}>
     <FormControl fullWidth>
    <Select
      labelId="modular-select-label"
      value={canvas?.modular || ''}
      onChange={(e) => handleModularSelection(e, canvas.id, currentSlide, setCurrentSlide, updateSlideData)}
      label=""
      style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '3vh',
      backgroundColor: 'lightgrey',
      borderRadius: '8px',
    }}
    >
      {modulars?.filter(modular => modular.type === 'Timer')
        .map((modular) => (
          <MenuItem key={modular.id} value={modular.id}>
            {modular.title}
          </MenuItem>
        ))}
    </Select>
  </FormControl>
  </div>
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
  </div>
)}


            </React.Fragment>
          ))}
        </div>
        <button onClick={addCanvasToDeck}>Add Slide</button>
      </div>
        {currentCanvas && (
      <div className="canvas-container" style={{maxHeight:'74.2vh' }}>
          <div style={{maxHeight:'74.2vh' }}>
       
           <div
  style={{
    maxHeight: '600px',
    position: 'relative',
  }}
  onClick={(e) => handleCanvasClick(e, toggleMode, setToggleMode, currentSlide, setCurrentSlide, currentCanvas, selectedContent, updateSlideData, selectedProperties, points, setPoints,connectionPoint, setConnectionPoint,gridLines)}
>
  {/* Canvas Element */}
  <canvas
    id="canvas"
    ref={canvasRef}
    style={{
      width: '100%', 
      height: '100%',
      position: 'absolute', 
      top: 0,
      left: 0,
    }}
  ></canvas>

  {gridLines && (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', 
      }}
    >
      {[...Array(Math.floor(600 / 10))].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${i * 10}px`, 
            left: '0',
            width: '100%',
            height: '1px',
            backgroundColor: '#ccc',
          }}
        />
      ))}
      {[...Array(Math.floor(800 / 10))].map((_, i) => (
        <div
          key={i + 600}
          style={{
            position: 'absolute',
            left: `${i * 10}px`, 
            top: '0',
            width: '1px',
            height: '100%',
            backgroundColor: '#ccc',
          }}
        />
      ))}
    </div>
  )}

  {/* Points Over Canvas */}
  {points.map((point, index) => (
    <div
      key={index}
      style={{
        position: 'absolute', 
        top: `${point.y}px`,
        left: `${point.x}px`,
        width: '10px', 
        height: '10px', 
        borderRadius: '50%', 
        backgroundColor: 'red', 
      }}
        onClick={(e) => {
        e.stopPropagation(); 
        setConnectionPoint(true);
      }}
    > {index+1} </div>
  ))}
</div>

            <div      style={{ display: canvasMode === 'elements' ? 'block' : 'none' }}>
            <CanvasControlElements
              backgroundColor={backgroundColor}
              selectedContent={selectedContent}
              selectedProperties={selectedProperties}
              getSizeValue={getSizeValue}
              updateProperty={updateProperty}
            />

            </div>
          <div      style={{ display: canvasMode === 'shapes' ? 'block' : 'none' }}>
            <CanvasControlShapes
              setToggleMode={setToggleMode}
              toggleMode={toggleMode}
            />

            </div>
            <div     style={{ display: canvasMode === 'colors' ? 'block' : 'none' }}>
             <CanvasControlColors
              backgroundColor={backgroundColor}
              selectedProperties={selectedProperties}
              updateProperty={updateProperty}
            />
            </div>
              <div      style={{ display: canvasMode === 'tools' ? 'block' : 'none' }}>
           <CanvasControlTools
  contentLock={contentLock}
  setContentLock={setContentLock}
  eyedropper={eyedropper}
  setEyedropper={setEyedropper}
  paintbrush={paintbrush}
  setPaintbrush={setPaintbrush}
  toggleMode={toggleMode}
  setToggleMode={setToggleMode}
  selectedProperties={selectedProperties}
  gridLines={gridLines}
  setGridLines={setGridLines}
  gridSnap={gridSnap}
  setGridSnap={setGridSnap}
/>

            </div>
          </div>
        <div style={{
  width: '4vw',
  paddingLeft: '1vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  border: '1px solid #ddd',
  padding: '10px',
  boxSizing: 'border-box'
}}>
  {buttons.map(({ mode, icon }) => (
    <div key={mode} style={{
      ...buttonStyles,
      backgroundColor: canvasMode === mode ? '#e0e0e0' : 'transparent'
    }}>
      <Icon icon={icon} width="2vw" height="2vh" onClick={() => setCanvasMode(mode)} />
    </div>
  ))}
</div>
       </div>
        )}
          

    </div>
  );
};




export default SlideManager;
