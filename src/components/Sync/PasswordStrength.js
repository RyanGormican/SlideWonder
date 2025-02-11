import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { Icon } from '@iconify/react';

const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [criteria, setCriteria] = useState({
    length: false,
    number: false,
    uppercase: false,
    specialChar: false,
  });

  useEffect(() => {
    const newCriteria = {
      length: password.length >= 8,
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setCriteria(newCriteria);
    setStrength(Object.values(newCriteria).filter(Boolean).length);
  }, [password]);

  // Color based on strength
  const getStrengthColor = () => {
    switch (strength) {
      case 1:
        return '#d32f2f';
      case 2:
        return '#f57c00';
      case 3:
        return  '#fbc02d';
      case 4:
        return '#388e3c';
      default:
        return '#ccc';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {password.length > 0 && (
        <Box>
          <Typography variant="body2" color="textSecondary">
            Password Strength:
          </Typography>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={strength * 25}
            sx={{
              marginBottom: 1,
              height: 6,
              borderRadius: 5,
              backgroundColor: '#ccc',
              '& .MuiLinearProgress-bar': { backgroundColor: getStrengthColor() },
            }}
          />

          {/* Criteria List */}
          <Box sx={{ display: 'flex', flexDirection: 'column',}}>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              {criteria.length ? <Icon icon="proicons:checkmark"color="green"/> : <Icon icon="iconoir:xmark" color="red"/>} At least 8 characters
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              {criteria.number ? <Icon icon="proicons:checkmark"color="green"/> : <Icon icon="iconoir:xmark" color="red" />} Contains a number
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              {criteria.uppercase ? <Icon icon="proicons:checkmark" color="green"/> : <Icon icon="iconoir:xmark"   color="red"/>} Contains an uppercase letter
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
              {criteria.specialChar ? <Icon icon="proicons:checkmark"color="green"/> :<Icon icon="iconoir:xmark"  color="red" />} Contains a special character
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PasswordStrength;
