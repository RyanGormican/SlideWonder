import React, { useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { renderCanvasContent } from './CanvasRender';
import { Icon } from '@iconify/react';
import { Canvas } from 'fabric';
import NotesModal from './NotesModal';  // Import the NotesModal component

const ITEM_TYPE = 'CANVAS_ITEM';

function DraggableCanvas({ canvas, index, moveCanvas, setCurrentCanvas, deleteCanvas, currentSlide, setCurrentSlide, copyCanvas, updateSlideData }) {
  const dragCanvasRef = useRef(null);
  const dragInstance = useRef(null);
  const [openNotesModal, setOpenNotesModal] = useState(false); // Modal state

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

  // Initialize and render the canvas
  useEffect(() => {
    if (dragCanvasRef.current) {
      dragInstance.current = new Canvas(dragCanvasRef.current, {
        width: 300,
        height: 200,
        preserveObjectStacking: true,
        backgroundColor: canvas.backgroundColor,
      });

      renderCanvasContent(dragInstance.current, canvas.content, 300, 200, 1);

      return () => {
        dragInstance.current.dispose(); // Clean up the canvas instance
      };
    }
  }, [canvas]);

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
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
          width="300"
          height="200"
        ></canvas>
      </div>
      {/* Wrapper for stacked controls */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2vh',
        }}
      >
        {/* Index */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #ccc',
          }}
        >
          {index + 1}
        </div>
        {/* Delete icon */}
        <Icon
          icon="mdi:trash"
          width="24"
          height="24"
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
        {/* Copy icon */}
        <Icon
          icon="mdi:content-copy"
          width="24"
          height="24"
          className="copy-icon"
          onClick={(e) => {
            e.stopPropagation();
            copyCanvas(canvas.id,currentSlide,setCurrentSlide,updateSlideData);
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
        {/* Notes icon */}
        <Icon
          icon="fluent:notepad-20-regular"
          width="24"
          height="24"
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
