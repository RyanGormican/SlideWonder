import React from 'react';
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';

const CanvasControls = ({
  backgroundColor,
  selectedContent,
  selectedProperties,
  handleBackgroundColorChange,
  handleColorChange,
  handleScaleChange,
  handleSizeChange,
  getSizeValue,
  setToggleMode,
  toggleMode,
  contentLock,
  setContentLock,
  handlePositionChange,
  handleOpacityChange,
}) => {
  return (
    <div className="canvas-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
        
        {/* Background Color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <Tooltip title="Background Color" arrow>
            <Icon icon="material-symbols-light:background-grid-small-sharp" width="24" height="24" />
          </Tooltip>
          <input
            id="background-color"
            type="color"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            style={{ cursor: 'pointer', flexGrow: '1' }}
          />
        </div>

        {/* Content Color */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <Tooltip title="Content Color" arrow>
            <Icon icon="mdi:shape" width="24" height="24" />
          </Tooltip>
          <input
            id="content-color"
            type="color"
            key={selectedProperties?.fill || '000000'}
            value={selectedProperties?.fill || '000000'}
            onChange={handleColorChange}
            style={{ cursor: 'pointer', flexGrow: '1' }}
          />
        </div>
      </div>
      <div>
<Tooltip title="Toggle Properties Copying" arrow>
<Icon icon={contentLock ? "material-symbols:lock" : "material-symbols:lock-open"}   onClick={() => setContentLock(!contentLock)}  width="24" height="24" />
</Tooltip>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
  
  {/* X Position */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
    <Tooltip title="X Position" arrow>
      <Icon icon="tabler:axis-x" width="24" height="24" />
    </Tooltip>
           <input
            id="x-Position-range"
            type="range"
            min="1"
            max="800"
        value={selectedProperties?.x || 0}
      onChange={(e) => handlePositionChange(e, 'x')}
            style={{ width: '100px', marginRight: '10px' }}
          />
              <input
      id="x-position"
      type="number"
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
            min="1"
            max="600"
        value={selectedProperties?.y || 0}
      onChange={(e) => handlePositionChange(e, 'y')}
            style={{ width: '100px', marginRight: '10px' }}
          />
    <input
      id="y-position"
      type="number"
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
            value={selectedProperties?.size || 12}
            onChange={handleSizeChange}
            style={{ width: '100px', marginRight: '10px' }}
          />
          <input
            type="number"
            value={selectedProperties?.size/2 || 12}
            onChange={handleSizeChange}
            style={{ width: '50px' }}
          />
        </div>
      </div>

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

export default CanvasControls;
