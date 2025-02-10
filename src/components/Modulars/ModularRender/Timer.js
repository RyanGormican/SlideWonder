import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const Timer = ({ selectedModular, renderHeight, renderWidth, time }) => {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);

  const { 
    timerDisplay, 
    lineStyle, 
    shape, 
    countdownStyle, 
    backgroundColor, 
    borderColor, 
    primaryColor, 
    secondaryColor 
  } = selectedModular.data || {};

  useEffect(() => {
    setTimeLeft(time);
    setProgress(0);
    setInitialTime(time);
  }, [time]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) setTimeLeft(0);
          return prev - 1;
        });
        if (initialTime > 0) {
          setProgress(((initialTime - (timeLeft - 1)) / initialTime) * 100); 
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, initialTime]);

  return (
    <Box
      sx={{
        height: renderHeight,
        width: renderWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${backgroundColor}`,
        position: 'relative', 
        backgroundColor
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
          width: renderWidth * 0.5,
          height: renderHeight * 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          outline: `1rem ${lineStyle} ${borderColor}`,
          borderRadius: shape === 'circle' ? '50%' : '0%',
          background: countdownStyle === 'Square Fill Bottom Right'
            ? `linear-gradient(to bottom right, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Square Fill Bottom Left'
            ? `linear-gradient(to bottom left, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Square Fill Top Right'
            ? `linear-gradient(to top right, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Square Fill Top Left'
            ? `linear-gradient(to top left, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Square Fill Left'
            ? `linear-gradient(to left, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Square Fill Right'
            ? `linear-gradient(to right, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Square Fill Top'
            ? `linear-gradient(to top, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Square Fill Bottom'
            ? `linear-gradient(to bottom, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Clockwise'
            ? `conic-gradient(${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : countdownStyle === 'Counterclockwise'
            ? `conic-gradient(${primaryColor} ${100 - progress}%, ${secondaryColor} ${100 - progress}% 100%)`
            : countdownStyle === 'Circle Fill'
            ? `radial-gradient(circle closest-side, ${primaryColor} ${progress}%, ${secondaryColor} ${progress}% 100%)`
            : 'none',

        }}
      >
        {timeLeft}
      </Box>
    </Box>
  );
};

export default Timer;
