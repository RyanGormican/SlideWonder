import React from 'react';
import { Icon } from '@iconify/react';
import Tooltip from '@mui/material/Tooltip';
import { SketchPicker } from 'react-color';

const CanvasControlColors = ({
  backgroundColor,
  handleBackgroundColorChange,
  selectedProperties,
  handleColorChange,
}) => {
  const pickerStyles = {
    default: {
      picker: {
        width: '100%',
        height: '11vh',
        display: 'flex',
        flexDirection: 'row',
      },
      saturation: {
        width: '70%',
        height: '10vh',
       paddingBottom: '0%',
      },
      controls: {
        width: '35%',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  };

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Tooltip title="Background Color" arrow>
          <Icon
            icon="material-symbols-light:background-grid-small-sharp"
            width="24"
            height="24"
          />
        </Tooltip>
        <div
          style={{
            width: '18vw',
            height: '12vh',
          }}
        >
          <SketchPicker
            id="background-color"
            color={backgroundColor}
            onChange={handleBackgroundColorChange}
            disableAlpha={true}
            styles={pickerStyles}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Tooltip title="Content Color" arrow>
          <Icon icon="mdi:shape" width="24" height="24" />
        </Tooltip>
        <div
          style={{
            width: '18vw',
            height: '12vh',
          }}
        >
          <SketchPicker
            id="content-color"
            color={selectedProperties?.fill || '#000000'}
            onChange={handleColorChange}
            disableAlpha={true}
            styles={pickerStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasControlColors;
