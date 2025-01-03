import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Icon } from '@iconify/react';

const ITEM_TYPE = 'CANVAS_ITEM';

function DraggableCanvas({ canvas, index, moveCanvas, setCurrentCanvas, deleteCanvas }) {
  const [, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index },
  });

  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCanvas(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

 

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
    >
      <canvas
        id={`canvas-preview-${canvas.id}`}
        width="300"
        height="200"
        style={{ display: 'block', backgroundColor: canvas.backgroundColor || '#ffffff' }}
        onClick={() => setCurrentCanvas(canvas.id)}
      ></canvas>

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
