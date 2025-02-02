import React from 'react';
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';

const CanvasControlTools = ({
  contentLock,
  setContentLock,
  eyedropper,
  setEyedropper,
  paintbrush,
  setPaintbrush,
  selectedProperties,
  gridLines,
  setGridLines,
  gridSnap,
  setGridSnap
}) => {
 

  return (
    <div
      className="canvas-controls"
      style={{
        display: 'flex',
        width: '31.25vw',
        gap: '0.75vw',
        height: '11vh'
      }}
    >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
  <div>
    <Tooltip title="Toggle Properties Copying" arrow>
      <Icon
        icon={contentLock ? "material-symbols:lock" : "material-symbols:lock-open"}
        onClick={() => setContentLock(!contentLock)}
        width="1.5rem"
        height="1.5rem"
        style={{
          backgroundColor: contentLock ? '#e0e0e0' : 'transparent',
          cursor: 'pointer',
        }}
      />
    </Tooltip>
  </div>
  <div>
    <Tooltip title="Toggle Object Eyedropper" arrow>
      <Icon
        icon="mdi:eyedropper"
        onClick={() => setEyedropper(!eyedropper)}
         width="1.5rem"
        height="1.5rem"
        style={{
          backgroundColor: eyedropper ? '#e0e0e0' : 'transparent',
          cursor: 'pointer',
        }}
      />
    </Tooltip>
  </div>
  <div>
    <Tooltip title="Toggle Paint Mode" arrow>
      <Icon
        icon="mdi:paintbrush"
        onClick={() => setPaintbrush(!paintbrush)}
         width="1.5rem"
        height="1.5rem"
        style={{
          backgroundColor: paintbrush ? '#e0e0e0' : 'transparent',
          cursor: 'pointer',
        }}
      />
    </Tooltip>
  </div>
</div>

      <div
  style={{
    width: '2.5vw',
    height: '2.5vw',
    backgroundColor: selectedProperties?.fill || '#000000',
    border: '1px solid black',
    marginTop: '20px',
  }}
>
</div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
   <div>
    <Tooltip title="Enable Grid Lines" arrow>
    <Icon
        icon="mdi:grid"
        onClick={() => setGridLines(!gridLines)}
        width="1.5rem"
        height="1.5rem"
        style={{
          backgroundColor: gridLines ? '#e0e0e0' : 'transparent',
          cursor: 'pointer',
        }}
      />
          </Tooltip>
    </div>
       <div>
    <Tooltip title="Snap to Grid" arrow>
    <Icon
        icon="mdi:magnet"
        onClick={() => setGridSnap(!gridSnap)}
        width="1.5rem"
        height="1.5rem"
        style={{
          backgroundColor: gridSnap ? '#e0e0e0' : 'transparent',
          cursor: 'pointer',
        }}
      />
          </Tooltip>
    </div>
    </div> 
    </div>
  );
};

export default CanvasControlTools;
