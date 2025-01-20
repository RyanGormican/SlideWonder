import React from 'react';
import { Icon } from '@iconify/react';

const CanvasControls = ({
  backgroundColor,
  selectedContent,
  handleBackgroundColorChange,
  handleColorChange,
  handleScaleChange,
  handleSizeChange,
  getSizeValue,
  setToggleMode,
  toggleMode
}) => {
  return (
    <div className="canvas-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
    <Icon icon="material-symbols-light:background-grid-small-sharp" width="24" height="24" />
    <label htmlFor="background-color" style={{ width: '150px' }}>Background Color</label>
    <input
      id="background-color"
      type="color"
      value={backgroundColor}
      onChange={handleBackgroundColorChange}
      style={{ cursor: 'pointer', flexGrow: '1' }}
    />
  </div>

  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
    <Icon icon="mdi:shape" width="24" height="24" />
    <label htmlFor="content-color" style={{ width: '150px' }}>Content Color</label>
    <input
      id="content-color"
      type="color"
      key={selectedContent?.fill || '000000'}
      value={selectedContent?.fill || '000000'}
      onChange={handleColorChange}
      style={{ cursor: 'pointer', flexGrow: '1' }}
    />
  </div>
</div>



      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor="x-scale-range" style={{ marginRight: '10px' }}>X Scale:</label>
          <input
            id="x-scale-range"
            type="range"
            min="1"
            max="100"
            value={selectedContent?.scaleX || 1}
            onChange={(e) => handleScaleChange(e, 'x')}
            style={{ width: '100px' }}
          />
          <input
            type="number"
            value={selectedContent?.scaleX || 1}
            onChange={(e) => handleScaleChange(e, 'x')}
            style={{ width: '50px', marginLeft: '10px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor="y-scale-range" style={{ marginRight: '10px' }}>Y Scale:</label>
          <input
            id="y-scale-range"
            type="range"
            min="1"
            max="100"
            value={selectedContent?.scaleY || 1}
            onChange={(e) => handleScaleChange(e, 'y')}
            style={{ width: '100px' }}
          />
          <input
            type="number"
            value={selectedContent?.scaleY || 1}
            onChange={(e) => handleScaleChange(e, 'y')}
            style={{ width: '50px', marginLeft: '10px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label htmlFor="size-range" style={{ marginRight: '10px' }}>Content Size:</label>
          <input
            id="size-range"
            type="range"
            min="1"
            max="100"
            value={getSizeValue(selectedContent)}
            onChange={handleSizeChange}
            style={{ width: '100px' }}
          />
          <input
            type="number"
            value={getSizeValue(selectedContent)}
            onChange={handleSizeChange}
            style={{ width: '50px', marginLeft: '10px' }}
          />
        </div>
      </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
  <Icon
    icon="humbleicons:text"
    width="24"
    height="24"
    onClick={() => setToggleMode(toggleMode === 'text' ? null : 'text')}
    style={{
      cursor: 'pointer',
      backgroundColor: toggleMode === 'text' ? '#e0e0e0' : '#fff',
      padding: '5px',
      borderRadius: '50%',
    }}
  />
  <Icon
    icon="material-symbols:circle"
    width="24"
    height="24"
    onClick={() => setToggleMode(toggleMode === 'circle' ? null : 'circle')}
    style={{
      cursor: 'pointer',
      backgroundColor: toggleMode === 'circle' ? '#e0e0e0' : '#fff',
      padding: '5px',
      borderRadius: '50%',
    }}
  />
  <Icon
    icon="material-symbols:square"
    width="24"
    height="24"
    onClick={() => setToggleMode(toggleMode === 'square' ? null : 'square')}
    style={{
      cursor: 'pointer',
      backgroundColor: toggleMode === 'square' ? '#e0e0e0' : '#fff',
      padding: '5px',
      borderRadius: '50%',
    }}
  />
  <Icon
    icon="mdi:triangle"
    width="24"
    height="24"
    onClick={() => setToggleMode(toggleMode === 'triangle' ? null : 'triangle')}
    style={{
      cursor: 'pointer',
      backgroundColor: toggleMode === 'triangle' ? '#e0e0e0' : '#fff',
      padding: '5px',
      borderRadius: '50%',
    }}
  />
   <Icon
    icon="icon-park-outline:picture"
    width="24"
    height="24"
    onClick={() => setToggleMode(toggleMode === 'image' ? null : 'image')}
    style={{
      cursor: 'pointer',
      backgroundColor: toggleMode === 'image' ? '#e0e0e0' : '#fff',
      padding: '5px',
      borderRadius: '50%',
      display: 'none',
    }}
  />
</div>

    </div>
  );
};

export default CanvasControls;
