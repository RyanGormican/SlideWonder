import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { renderCanvasContent } from './CanvasRender';
import { Icon } from '@iconify/react';
import { Canvas } from 'fabric';
import NotesModal from '../NotesModal';  
import Tooltip from '@mui/material/Tooltip';

const ITEM_TYPE = 'CANVAS_ITEM';

function DraggableCanvas({ canvas, index, moveCanvas, setCurrentCanvas, deleteCanvas, currentSlide, setCurrentSlide, copyCanvas, updateSlideData, personalTemplates, setPersonalTemplates }) {
  const dragCanvasRef = useRef(null);
  const containerRef = useRef(null); // Reference for container div
  const dragInstance = useRef(null);
  const [openNotesModal, setOpenNotesModal] = useState(false); 

  // Drag functionality
  const [, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index },
  });

  // Drop functionality
  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCanvas(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  // Combine drag and drop refs
  const dragDropRef = (node) => {
    dragRef(node);
    dropRef(node);
    containerRef.current = node; // Assign containerRef to the div itself
  };
 const copyObject = (canvasId, currentSlide) => {
  const canvasToCopy = currentSlide.deck.find((canvas) => canvas.id === canvasId);

  if (!canvasToCopy) {
    console.error('Canvas not found');
    return;
  }
    let slideWonderData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
  let templates = slideWonderData.personaltemplates || [];

  const newCanvas = { 
    ...canvasToCopy,
    text: `My Template [${templates.length+1}]`,
    description: `This is my template made on ${new Date().toLocaleString()}`, 
    id: Date.now(),
  };




  const duplicateIndex = templates.findIndex((template) => 
    JSON.stringify(template) === JSON.stringify(newCanvas)
  );

  if (duplicateIndex === -1) {
    templates.push(newCanvas);
  } else {
    templates[duplicateIndex] = newCanvas;
  }

  slideWonderData.personaltemplates = templates;
  setPersonalTemplates(templates);
  localStorage.setItem('SlideWonderdata', JSON.stringify(slideWonderData));
};




  // Initialize and render the canvas dynamically based on container size
  useEffect(() => {
    if (dragCanvasRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
const containerHeight = ( window.innerHeight * 0.20); 


      dragInstance.current = new Canvas(dragCanvasRef.current, {
        width: containerWidth,
        height: containerHeight,
        preserveObjectStacking: true,
        backgroundColor: canvas.backgroundColor,
      });

 
      renderCanvasContent(dragInstance.current, canvas.content, containerWidth, containerHeight, 1);

      return () => {
        dragInstance.current.dispose(); 
      };
    }
  }, [canvas,currentSlide]);

  return (
    <div
      ref={dragDropRef} 
      className="canvas-item"
      style={{
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'grab',
        position: 'relative',
      }}
      onClick={() => setCurrentCanvas(canvas.id)}
    >
      <div className="locked">
        <canvas
          ref={dragCanvasRef}
          id={`canvas-preview-${canvas.id}`}
          style={{ width: '100%', height: '100%', paddingBottom: '2rem' }} 
        ></canvas>
      </div>

      {/* Wrapper for stacked controls, positioned at the bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '0', 
          left: '0',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: '2vh',
          paddingTop: '2rem', 
        }}
      >
        {/* Index */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ccc',
          }}
        >
          {index + 1}
        </div>
        {/* Delete icon */}
       <Tooltip title="Delete Slide" arrow>
        <Icon
          icon="mdi:trash"
          width="2rem"
          height="2rem"
          className="delete-icon"
          onClick={() => deleteCanvas(canvas.id)}
          style={{
            color: 'red',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: '50%',
            padding: '4px',
            border: '1px solid #ccc',
          }}
        />
        </Tooltip>
        {/* Copy icon */}
        <Tooltip title="Copy Slide" arrow>
        <Icon
          icon="mdi:content-copy"
          width="2rem"
          height="2rem"
          className="copy-icon"
          onClick={(e) => {
            e.stopPropagation();
            copyCanvas(canvas.id, currentSlide, setCurrentSlide, updateSlideData);
          }}
          style={{
            color: '#4caf50',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: '50%',
            padding: '4px',
            border: '1px solid #ccc',
          }}
        />
       </Tooltip>
        <Tooltip title="Save Slide To Templates" arrow>
        <Icon
          icon="icon-park-outline:page-template"
          width="2rem"
          height="2rem"
          className="copy-icon"
          onClick={(e) => {
            e.stopPropagation();
           copyObject(canvas.id, currentSlide);
          }}
          style={{
            color: '#7921ea',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: '50%',
            padding: '4px',
            border: '1px solid #ccc',
          }}
        />
        </Tooltip>
        {/* Notes icon */}
        <Tooltip title="Open Slide Notes" arrow>
        <Icon
          icon="fluent:notepad-20-regular"
          width="2rem"
          height="2rem"
          className="note-icon"
          onClick={(e) => {
            e.stopPropagation();
            setOpenNotesModal(true); 
          }}
          style={{
            color: '#3b9ab8',
            cursor: 'pointer',
            background: '#fff',
            borderRadius: '50%',
            padding: '4px',
            border: '1px solid #ccc',
          }}
        />
          </Tooltip>
      </div>
   
      {/* Notes Modal */}
      <NotesModal
        open={openNotesModal}
        onClose={() => setOpenNotesModal(false)}
        canvasId={canvas.id}
        currentSlide={currentSlide}
        updateSlideData={updateSlideData}
      />
    </div>
  );
}

export default DraggableCanvas;
