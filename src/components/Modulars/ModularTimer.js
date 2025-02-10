import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Typography, Button } from '@mui/material';
import Timer from './ModularRender/Timer';

const ModularTimer = ({ selectedModular, renderHeight, renderWidth, modulars, setModulars }) => {
  const [shape, setShape] = useState(selectedModular?.data?.shape || 'circle');
  const [lineStyle, setLineStyle] = useState(selectedModular?.data?.lineStyle || 'solid');
  const [number, setNumber] = useState(selectedModular?.data?.number || 0);
  const [timerDisplay, setTimerDisplay] = useState(selectedModular?.data?.timerDisplay || '');
  const [time, setTime] = useState(number);
  const [countdownStyle, setCountdownStyle] = useState(selectedModular?.data?.countdownStyle || 'Clockwise');
  const [backgroundColor, setBackgroundColor] = useState(selectedModular?.data?.backgroundColor || '#ffffff');
  const [borderColor, setBorderColor] = useState(selectedModular?.data?.borderColor || 'black');
  const [primaryColor, setPrimaryColor] = useState(selectedModular?.data?.primaryColor || '#2196F3');
  const [secondaryColor, setSecondaryColor] = useState(selectedModular?.data?.secondaryColor || '#dddddd');
  const updateModularData = (updatedFields) => {
    setModulars((prevModulars) =>
      prevModulars.map((modular) =>
        modular.id === selectedModular.id
          ? {
              ...modular,
              data: { ...modular.data, ...updatedFields },
              lastUpdated: Date.now(),
            }
          : modular
      )
    );
  };

  const handleShapeChange = (event) => {
    const newShape = event.target.value;
    setShape(newShape);
    updateModularData({ shape: newShape });
  };

  const handleLineStyleChange = (event) => {
    const newLineStyle = event.target.value;
    setLineStyle(newLineStyle);
    updateModularData({ lineStyle: newLineStyle });
  };

  const handleNumberChange = (event) => {
    const newNumber = parseInt(event.target.value, 10) || 0;
    setNumber(newNumber);
    updateModularData({ number: newNumber });
  };

  const handleTimerDisplayChange = (event) => {
    const newTimerDisplay = event.target.value;
    setTimerDisplay(newTimerDisplay);
    updateModularData({ timerDisplay: newTimerDisplay });
  };

  const handleCountdownStyleChange = (event) => {
    const newCountdownStyle = event.target.value;
    setCountdownStyle(newCountdownStyle);
    updateModularData({ countdownStyle: newCountdownStyle });
  };

  const handleStartTimer = () => {
      setTime(number);
  };

  const handleStopTimer = () => {
    if (time > 0) {
      setTime(0);
    }
  };
   const handleBackgroundColorChange = (event) => {
    const newBackgroundColor = event.target.value;
    setBackgroundColor(newBackgroundColor);
    updateModularData({ backgroundColor: newBackgroundColor });
  };

  const handleBorderColorChange = (event) => {
    const newBorderColor = event.target.value;
    setBorderColor(newBorderColor);
    updateModularData({ borderColor: newBorderColor });
  };

  const handlePrimaryColorChange = (event) => {
    const newPrimaryColor = event.target.value;
    setPrimaryColor(newPrimaryColor);
    updateModularData({ primaryColor: newPrimaryColor });
  };

  const handleSecondaryColorChange = (event) => {
    const newSecondaryColor = event.target.value;
    setSecondaryColor(newSecondaryColor);
    updateModularData({ secondaryColor: newSecondaryColor });
  };

  useEffect(() => {
  if (selectedModular) {
    setShape(selectedModular?.data?.shape || 'circle');
    setLineStyle(selectedModular?.data?.lineStyle || 'solid');
    setNumber(selectedModular?.data?.number || 0);
    setTimerDisplay(selectedModular?.data?.timerDisplay || '');
    setTime(selectedModular?.data?.number || 0);
    setCountdownStyle(selectedModular?.data?.countdownStyle || 'Clockwise');
    setBackgroundColor(selectedModular?.data?.backgroundColor || '#ffffff');
    setBorderColor(selectedModular?.data?.borderColor || 'black');
    setPrimaryColor(selectedModular?.data?.primaryColor || '#2196F3');
    setSecondaryColor(selectedModular?.data?.secondaryColor || '#dddddd');
  }
}, [selectedModular]);
  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Display Section */}
      <Timer selectedModular={selectedModular} renderHeight={renderHeight} renderWidth={renderWidth} time={time} />

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, flex: 1 }}>
      <Typography variant="h6">Timer Options</Typography>

      <FormControl>
        <InputLabel>Shape</InputLabel>
        <Select value={shape} onChange={handleShapeChange}>
          <MenuItem value="circle">Circle</MenuItem>
          <MenuItem value="square">Square</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Border Style</InputLabel>
        <Select value={lineStyle} onChange={handleLineStyleChange}>
          <MenuItem value="solid">Solid</MenuItem>
          <MenuItem value="dashed">Dashed</MenuItem>
          <MenuItem value="dotted">Dotted</MenuItem>
          <MenuItem value="double">Double</MenuItem>
          <MenuItem value="groove">Groove</MenuItem>
          <MenuItem value="ridge">Ridge</MenuItem>
          <MenuItem value="inset">Inset</MenuItem>
          <MenuItem value="outset">Outset</MenuItem>
          <MenuItem value="none">None</MenuItem>
        </Select>
      </FormControl>

      <TextField label="Seconds" type="number" value={number} onChange={handleNumberChange} />

      <TextField label="Timer Display" value={timerDisplay} onChange={handleTimerDisplayChange} />

      <FormControl>
        <InputLabel>Countdown Style</InputLabel>
       <Select value={countdownStyle} onChange={handleCountdownStyleChange}>
  <MenuItem value="Circle Fill">Circle Fill</MenuItem>
  <MenuItem value="Clockwise">Clockwise</MenuItem>
  <MenuItem value="Counterclockwise">Counter Clockwise</MenuItem>
  <MenuItem value="Number Only">Number Only</MenuItem>
  <MenuItem value="Square Fill Bottom">Square Fill Bottom</MenuItem>
  <MenuItem value="Square Fill Bottom Left">Square Fill Bottom Left</MenuItem>
  <MenuItem value="Square Fill Bottom Right">Square Fill Bottom Right</MenuItem>
  <MenuItem value="Square Fill Left">Square Fill Left</MenuItem>
  <MenuItem value="Square Fill Right">Square Fill Right</MenuItem>
  <MenuItem value="Square Fill Top">Square Fill Top</MenuItem>
  <MenuItem value="Square Fill Top Left">Square Fill Top Left</MenuItem>
  <MenuItem value="Square Fill Top Right">Square Fill Top Right</MenuItem>
</Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleStartTimer} disabled={time > 0}>
        {time > 0 ? 'Running...' : 'Start Timer'}
      </Button>

      <Button variant="contained" color="error" onClick={handleStopTimer} disabled={time <= 0}>
        STOP
      </Button>
    </Box>

    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2, flex: 1 }}>
 <Typography variant="h6" sx={{ visibility: 'hidden' }}>
 Colors
</Typography>

  <div style={{ display: 'grid', gridTemplateColumns: '10vw auto', gap: '8px', alignItems: 'center' }}>
    <div>Background Color</div>
    <input
      type="color"
      value={backgroundColor}
      onChange={handleBackgroundColorChange}
      title="Choose Background Color"
    />
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '10vw auto', gap: '8px', alignItems: 'center' }}>
    <div>Border Color</div>
    <input
      type="color"
      value={borderColor}
      onChange={handleBorderColorChange}
      title="Choose Border Color"
    />
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '10vw auto', gap: '8px', alignItems: 'center' }}>
    <div>Primary Color</div>
    <input
      type="color"
      value={primaryColor}
      onChange={handlePrimaryColorChange}
      title="Choose Primary Color"
    />
  </div>

  <div style={{ display: 'grid', gridTemplateColumns: '10vw auto', gap: '8px', alignItems: 'center' }}>
    <div>Secondary Color</div>
    <input
      type="color"
      value={secondaryColor}
      onChange={handleSecondaryColorChange}
      title="Choose Secondary Color"
    />
  </div>
</Box>


    </Box>
  );
};

export default ModularTimer;
