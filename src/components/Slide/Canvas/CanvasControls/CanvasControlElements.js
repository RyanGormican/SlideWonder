import React from 'react';
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';


const CanvasControlElements = ({
  backgroundColor,
  selectedContent,
  selectedProperties,
  handleScaleChange,
  handleSizeChange,
  getSizeValue,
  setToggleMode,
  toggleMode,
  handlePositionChange,
  handleOpacityChange,
  handleStrokeChange, 
  handleStrokeWidthChange
}) => {
  return (
    <div className="canvas-controls" style={{ display: 'flex', justifyContent: 'space-between',  alignItems: 'center',   height: '11vh' }}>
 
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
  
  {/* X Position */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
    <Tooltip title="X Position" arrow>
      <Icon icon="tabler:axis-x" width="24" height="24" />
    </Tooltip>
           <input
            id="x-Position-range"
            type="range"
            min="0"
            max="800"
        value={selectedProperties?.x || 0}
      onChange={(e) => handlePositionChange(e, 'x')}
            style={{ width: '100px', marginRight: '10px' }}
          />
              <input
      id="x-position"
      type="number"
      step="0.1"
      value={selectedProperties?.x || 0}
      onChange={(e) => handlePositionChange(e, 'x')}
      style={{ width: '50px' }}
    />
  </div>

  {/* Y Position */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
    <Tooltip title="Y Position" arrow>
      <Icon icon="tabler:axis-y" width="24" height="24" />
    </Tooltip>
          <input
            id="y-Position-range"
            type="range"
            min="0"
            max="600"
        value={selectedProperties?.y || 0}
      onChange={(e) => handlePositionChange(e, 'y')}
            style={{ width: '100px', marginRight: '10px' }}
          />
    <input
      id="y-position"
      type="number"
       step="0.1"
      value={selectedProperties?.y || 0}
      onChange={(e) => handlePositionChange(e, 'y')}
      style={{ width: '50px' }}
    />
  </div>

  {/* Opacity */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
    <Tooltip title="Opacity" arrow>
      <Icon icon="material-symbols:opacity" width="24" height="24" />
    </Tooltip>
    <input
      id="opacity"
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={selectedProperties?.opacity || 1}
      onChange={(e) => handleOpacityChange(e)}
      style={{ width: '100px', marginRight: '10px' }}
    />
    <input
      type="number"
      value={selectedProperties?.opacity || 1}
      onChange={(e) => handleOpacityChange(e)}
      style={{ width: '50px' }}
    />
  </div>
</div>

      {/* Scale and Size Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        
        {/* X Scale */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <Tooltip title="X Scale" arrow>
            <Icon icon="tabler:letter-x" width="24" height="24" />
          </Tooltip>
          <input
            id="x-scale-range"
            type="range"
            min="1"
            max="100"
            value={selectedProperties?.scaleX || 1}
            onChange={(e) => handleScaleChange(e, 'x')}
            style={{ width: '100px', marginRight: '10px' }}
          />
          <input
            type="number"
            step="0.1"
            value={selectedProperties?.scaleX || 1}
            onChange={(e) => handleScaleChange(e, 'x')}
            style={{ width: '50px' }}
          />
        </div>

        {/* Y Scale */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <Tooltip title="Y Scale" arrow>
            <Icon icon="tabler:letter-y" width="24" height="24" />
          </Tooltip>
          <input
            id="y-scale-range"
            type="range"
            min="1"
            max="100"
    
            value={selectedProperties?.scaleY || 1}
            onChange={(e) => handleScaleChange(e, 'y')}
            style={{ width: '100px', marginRight: '10px' }}
          />
          <input
            type="number"
            step="0.1"
            value={selectedProperties?.scaleY || 1}
            onChange={(e) => handleScaleChange(e, 'y')}
            style={{ width: '50px' }}
          />
        </div>

        {/* Content Size */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <Tooltip title="Content Size" arrow>
            <Icon icon="icon-park-outline:scale" width="24" height="24"  />
          </Tooltip>
          <input
            id="size-range"
            type="range"
            min="1"
            max="100"
           value={selectedProperties?.size > 0 ? selectedProperties.size : 12}
            onChange={handleSizeChange}
            style={{ width: '100px', marginRight: '10px' }}
          />
          <input
            type="number"
           value={selectedProperties?.size > 0 ? selectedProperties.size : 12}
            onChange={handleSizeChange}
            style={{ width: '50px' }}
          />
        </div>
      </div>

  {/* Stroke and Stroke Width */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        {/* Stroke Color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <Tooltip title="Stroke Color" arrow>
           <Icon icon="mdi:bucket" width="24" height="24" />
          </Tooltip>
          <input
            id="stroke-color"
            type="color"
            value={selectedProperties?.stroke || "#000000"}
            onChange={(e) => handleStrokeChange(e.target.value)}  
            style={{ width: '40px' }}
          />
        </div>

        {/* Stroke Width */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <Tooltip title="Stroke Width" arrow>
            <Icon icon="mdi:brush" width="24" height="24" />
          </Tooltip>
          <input
            id="stroke-width-range"
            type="range"
            min="1"
            max="10"
            value={selectedProperties?.strokeWidth || 1}
            onChange={(e) => handleStrokeWidthChange(e.target.value)}  
            style={{ width: '100px', marginRight: '10px' }}
          />
          <input
            type="number"
            value={selectedProperties?.strokeWidth || 1}
            onChange={(e) => handleStrokeWidthChange(e.target.value)}  
            style={{ width: '50px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasControlElements;
