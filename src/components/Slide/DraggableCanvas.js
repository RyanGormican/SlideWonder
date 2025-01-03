import React, { useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { renderCanvasContent } from './CanvasRender'; // Import the shared function
import { Icon } from '@iconify/react';
import { Canvas } from 'fabric';

const ITEM_TYPE = 'CANVAS_ITEM';

function DraggableCanvas({ canvas, index, moveCanvas, setCurrentCanvas, deleteCanvas }) {
  const dragCanvasRef = useRef(null); // Reference to the <canvas> DOM element
  const dragInstance = useRef(null); // Reference to the fabric.Canvas instance

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
      // Initialize fabric.Canvas
      dragInstance.current = new Canvas(dragCanvasRef.current, {
        width: 300,
        height: 200,
        preserveObjectStacking: true,
        backgroundColor: canvas.backgroundColor,
      });

      // Render content on the canvas
      renderCanvasContent(dragInstance.current, canvas.content, 300, 200,false);

      return () => {
        dragInstance.current.dispose(); // Clean up the canvas instance
      };
    }
  }, [canvas]);

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className="canvas-item "
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
      {/* Delete icon */}
      <Icon
        icon="mdi:trash"
        width="24"
        height="24"
        className="delete-icon"
        onClick={() => deleteCanvas(canvas.id)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'red',
          cursor: 'pointer',
          background: '#fff',
          borderRadius: '50%',
          padding: '4px',
        }}
      />
    </div>
  );
}

export default DraggableCanvas;
