import React from 'react';
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';

const CanvasControlShapes = ({
 toggleMode,
 setToggleMode
}) => {
 

  return (
    <div
      className="canvas-controls"
      style={{
        display: 'flex',
        width: '31.25vw',
        gap: '20px',
        height: '11vh'
      }}
    >
        {/* Toggle Icons */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {['text', 'circle', 'square', 'triangle'].map((mode, idx) => (
          <Tooltip title={mode.charAt(0).toUpperCase() + mode.slice(1)} arrow key={idx}>
            <Icon
              icon={mode === 'text' ? "humbleicons:text" :
                    mode === 'circle' ? "material-symbols:circle" :
                    mode === 'square' ? "material-symbols:square" :
                    mode === 'triangle' ? "mdi:triangle" : ""}
              width="24"
              height="24"
              onClick={() => setToggleMode(toggleMode === mode ? null : mode)}
              style={{
                cursor: 'pointer',
                backgroundColor: toggleMode === mode ? '#e0e0e0' : '#fff',
                padding: '5px',
                borderRadius: '50%',
              }}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default CanvasControlShapes;
