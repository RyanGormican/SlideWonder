import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, TextField, FormControl, InputLabel, Typography, Button } from '@mui/material';

const ModularTimer = ({ selectedModular, chartHeight, chartWidth, modulars, setModulars }) => {
  const [shape, setShape] = useState(selectedModular?.shape || 'circle');
  const [lineStyle, setLineStyle] = useState(selectedModular?.lineStyle || 'solid');
  const [number, setNumber] = useState(selectedModular?.number || 0);
  const [timerDisplay, setTimerDisplay] = useState(selectedModular?.timerDisplay || '');
  const [timeLeft, setTimeLeft] = useState(number);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [countdownStyle, setCountdownStyle] = useState('Clockwise'); 

  const updateModularData = (updatedFields) => {
    setModulars((prevModulars) =>
      prevModulars.map((modular) =>
        modular.id === selectedModular.id ? { ...modular, ...updatedFields, lastUpdated: Date.now() } : modular
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
    setTimeLeft(newNumber);
    setProgress(0);
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
    if (number > 0) {
      setTimeLeft(number);
      setIsRunning(true);
      setProgress(0);
    }
  };

  const handleStopTimer = () => {
    if (number > 0) {
      setTimeLeft(0);
      setIsRunning(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            setIsRunning(false);
          }
          return prev - 1;
        });
        setProgress((prevProgress) => prevProgress + 100 / number);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, number]);

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      {/* Display Section */}
      <Box
        sx={{
          height: chartHeight,
          width: chartWidth,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ddd',
          position: 'relative', 
        }}
      >

        <Box
          sx={{
            position: 'absolute',
            top: 8, 
            width: '100%',
            textAlign: 'center',
            fontSize: '1.2rem', 
          }}
        >
          {timerDisplay}
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: chartHeight * 0.5,
            height: chartWidth * 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            border: `1rem ${lineStyle} black`,
            borderRadius: shape === 'circle' ? '50%' : '0%',
           background: countdownStyle === 'Square Fill Bottom Right'
  ? `linear-gradient(to bottom right, #2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Square Fill Bottom Left'
  ? `linear-gradient(to bottom left, #2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Square Fill Top Right'
  ? `linear-gradient(to top right, #2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Square Fill Top Left'
  ? `linear-gradient(to top left, #2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Square Fill Horizontal Left'
  ? `linear-gradient(to left, #2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Square Fill Horizontal Right'
  ? `linear-gradient(to right, #2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Square Fill Vertical Top'
  ? `linear-gradient(to top, #2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Square Fill Vertical Bottom'
  ? `linear-gradient(to bottom, #2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Clockwise'
  ? `conic-gradient(#2196F3 ${progress}%, #ddd ${progress}% 100%)`
  : countdownStyle === 'Counterclockwise'
  ? `conic-gradient(#2196F3 ${100 - progress}%, #ddd ${100 - progress}% 100%)`
  : countdownStyle === 'Circle Fill'
  ? `radial-gradient(circle closest-side, #2196F3 ${progress}%, #ddd ${progress}% 100%)` :'none',
          }}
        >
          {timeLeft}
        </Box>
      </Box>

      {/* Options Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
        <Typography variant="h6">Timer Options</Typography>

        {/* Shape Selection */}
        <FormControl>
          <InputLabel>Shape</InputLabel>
          <Select value={shape} onChange={handleShapeChange}>
            <MenuItem value="circle">Circle</MenuItem>
            <MenuItem value="square">Square</MenuItem>
          </Select>
        </FormControl>

        {/* Line Style Selection */}
        <FormControl>
          <InputLabel>Line Style</InputLabel>
          <Select value={lineStyle} onChange={handleLineStyleChange}>
            <MenuItem value="solid">Solid</MenuItem>
            <MenuItem value="dashed">Dashed</MenuItem>
          </Select>
        </FormControl>

        {/* Number Input */}
        <TextField label="Seconds" type="number" value={number} onChange={handleNumberChange} />

        {/* Timer Display Input */}
        <TextField label="Timer Display" value={timerDisplay} onChange={handleTimerDisplayChange} />

        {/* Countdown Style Selection */}
        <FormControl>
          <InputLabel>Countdown Style</InputLabel>
          <Select value={countdownStyle} onChange={handleCountdownStyleChange}>
            <MenuItem value="Clockwise">Clockwise</MenuItem>
    <MenuItem value="Counterclockwise">Counter Clockwise</MenuItem>
    <MenuItem value="Square Fill Bottom Right">Square Fill Bottom Right</MenuItem>
    <MenuItem value="Square Fill Bottom Left">Square Fill Bottom Left</MenuItem>
    <MenuItem value="Square Fill Top Right">Square Fill Top Right</MenuItem>
    <MenuItem value="Square Fill Top Left">Square Fill Top Left</MenuItem>
    <MenuItem value="Square Fill Horizontal Left">Square Fill Horizontal Left</MenuItem>
    <MenuItem value="Square Fill Horizontal Right">Square Fill Horizontal Right</MenuItem>
    <MenuItem value="Square Fill Vertical Top">Square Fill Vertical Top</MenuItem>
    <MenuItem value="Square Fill Vertical Bottom">Square Fill Vertical Bottom</MenuItem>
    <MenuItem value="Circle Fill">Circle Fill</MenuItem>
    <MenuItem value="Number Only">Number Only</MenuItem>
          </Select>
        </FormControl>

        {/* Play Button */}
        <Button variant="contained" color="primary" onClick={handleStartTimer} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Start Timer'}
        </Button>

        {/* Stop Button */}
        <Button variant="contained" color="error" onClick={handleStopTimer} disabled={!isRunning}>
          STOP
        </Button>
      </Box>
    </Box>
  );
};

export default ModularTimer;
