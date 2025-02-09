import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Paper, Input, TextField, MenuItem, Select } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ModularChart from './ModularChart';
import ModularTimer from './ModularTimer';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Modulars = ({ modulars, setModulars, view }) => {
  const [selectedModularId, setSelectedModularId] = useState(null);
  const [chartHeight, setChartHeight] = useState(0);
  const [chartWidth, setChartWidth] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newChartTitle, setNewChartTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const defaultChartData = {
    labels: ['Data'],
    datasets: [{ label: 'My Dataset', data: [1] }],
  };

  const defaultChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Basic Bar Chart' },
    },
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setChartHeight(window.innerHeight * 0.8);
      setChartWidth(window.innerWidth * 0.4);
    }
  }, [view]);

  const handleCreateNewModular = () => {
    const newModular = {
      title: `My Modular ${modulars.length + 1}`,
      type: 'Bar Chart',
      id: Date.now(),
      lastCreated: Date.now(),
      lastUpdated: Date.now(),
      data: defaultChartData,
      options: defaultChartOptions,
    };
    setModulars([...modulars, newModular]);
  };

  const handleSelectModular = (modular) => {
    setSelectedModularId(modular.id);
    setNewTitle(modular.title);
    setNewChartTitle(modular.options.plugins.title.text);
    setSelectedType(modular.type);
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleSaveTitle = () => {
    setModulars((prevModulars) =>
      prevModulars.map((modular) =>
        modular.id === selectedModularId ? { ...modular, title: newTitle } : modular
      )
    );
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setModulars((prevModulars) =>
      prevModulars.map((modular) =>
        modular.id === selectedModularId ? { ...modular, type: newType } : modular
      )
    );
  };

  const selectedModular = modulars.find((modular) => modular.id === selectedModularId);

  return (
    <div>
      <h1>Modular Workshop</h1>
      <Box display="flex" height="80vh" width="100vw">
        <Box
          sx={{
            position: 'relative',
            left: 0,
            width: '10vw',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #ddd',
            backgroundColor: '#fff',
          }}
        >
          <Box flex="1" overflow="auto" p={1}>
            {modulars.map((modular) => (
              <Paper
                key={modular.id}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  backgroundColor: selectedModularId === modular.id ? '#f0f0f0' : 'white',
                }}
                onClick={() => handleSelectModular(modular)}
              >
                <Typography variant="h6">{modular.title}</Typography>
                <Typography variant="body2">Type: {modular.type}</Typography>
              </Paper>
            ))}
          </Box>
          <Box p={1}>
            <Button fullWidth variant="contained" color="primary" onClick={handleCreateNewModular}>
              NEW MODULAR
            </Button>
          </Box>
        </Box>

        <Box sx={{ flex: 1, p: 2 }}>
          {selectedModular ? (
            <div>
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    label="Title"
                    value={newTitle}
                    onChange={handleTitleChange}
                    onBlur={handleSaveTitle}
                    sx={{ width: '60%', mr: 2 }}
                  />
                  <Select  value={selectedType} onChange={handleTypeChange} sx={{ width: '30%' }}>
                    <MenuItem value="Bar Chart">Bar Chart</MenuItem>
                    <MenuItem value="Timer">Timer</MenuItem>
                  </Select>
                </Box>
                {selectedModular.type === 'Bar Chart' && (
                  <ModularChart
                    selectedModular={selectedModular}
                    chartHeight={chartHeight}
                    chartWidth={chartWidth}
                    modulars={modulars}
                    setModulars={setModulars}
                    newChartTitle={newChartTitle}
                    selectedModularId={selectedModularId}
                  />
                )}
                {selectedModular.type === 'Timer' && <Typography variant="h6">
                 <ModularTimer
                    selectedModular={selectedModular}
                    chartHeight={chartHeight}
                    chartWidth={chartWidth}
                    modulars={modulars}
                    setModulars={setModulars}
                  />
               </Typography>}
              </Box>
            </div>
          ) : (
            <Typography variant="h6">Select a modular to edit</Typography>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Modulars;
