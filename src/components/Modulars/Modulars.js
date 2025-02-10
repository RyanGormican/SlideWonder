import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, Paper, Input, TextField, FormControl, InputLabel, MenuItem, Select, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ModularChart from './ModularChart';
import ModularTimer from './ModularTimer';
import { Icon } from '@iconify/react';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Modulars = ({ modulars, setModulars, view }) => {
  const [selectedModularId, setSelectedModularId] = useState(null);
  const [renderHeight, setRenderHeight] = useState(0);
  const [renderWidth, setRenderWidth] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [newChartTitle, setNewChartTitle] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [modularToDelete, setModularToDelete] = useState(null);

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
   const defaultTimerData = {
    shape: 'circle',
    lineStyle: 'solid',
    number: 0,
    timerDisplay: '',
    countdownStyle: 'Clockwise',
    backgroundColor: '#ffffff',
    borderColor: 'black',
    primaryColor:'#2196F3',
    secondaryColor: '#dddddd',
  };  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRenderHeight(window.innerHeight * 0.8);
      setRenderWidth(window.innerWidth * 0.4);
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
    if (selectedModular?.type === 'Bar Chart'){
  setNewChartTitle(modular.options?.plugins.title.text || '');
    }
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

  // Update modulars based on selectedType
  setModulars((prevModulars) =>
    prevModulars.map((modular) => {
      if (modular.id === selectedModular.id) {

        if (newType === 'Timer') {
          return {
            ...modular,
            type: newType,
            data: defaultTimerData,
            options: null, 
          };
        }

        else if (newType === 'Bar Chart') {
          return {
            ...modular,
            type: newType,
            data: defaultChartData, 
            options: defaultChartOptions, 
          };
        }
      }
      return modular; 
    })
  );
};
const handleDeleteModular = (modular) => {
  setModulars((prevModulars) =>
    prevModulars.filter((item) => item.id !== modular.id)
  );
  setSelectedModularId(null); 
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
            width: '12vw',
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
        backgroundColor: selectedModular?.id === modular.id ? '#f0f0f0' : 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onClick={() => handleSelectModular(modular)}
    >
      <Box>
        <Typography variant="h6">{modular.title}</Typography>
        <Typography variant="body2">Type: {modular.type}</Typography>
      </Box>
      <Button
        variant="outlined"
        color="error"
        onClick={(e) => {
          e.stopPropagation(); 
          setModularToDelete(modular);
          setOpenDeleteDialog(true); 
        }}
      >
          <Icon color="red" icon="mdi:trash" />
      </Button>
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
                 <FormControl sx={{ width: '30%' }}>
  <InputLabel>Modular Options</InputLabel>
  <Select
    value={selectedType}
    onChange={handleTypeChange}
    label="Modular Options" 
  >
    <MenuItem value="Bar Chart">
      Bar Chart <Icon icon="ix:barchart" />
    </MenuItem>
    <MenuItem value="Timer">
      Timer <Icon icon="mdi:clock" />
    </MenuItem>
  </Select>
</FormControl>
                </Box>
                {selectedModular.type === 'Bar Chart' && (
                  <ModularChart
                    selectedModular={selectedModular}
                    renderHeight={renderHeight}
                    renderWidth={renderWidth}
                    modulars={modulars}
                    setModulars={setModulars}
                    newChartTitle={newChartTitle}
                    selectedModularId={selectedModularId}
                  />
                )}
                {selectedModular.type === 'Timer' && <Typography variant="h6">
                 <ModularTimer
                    selectedModular={selectedModular}
                    renderHeight={renderHeight}
                    renderWidth={renderWidth}
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
      <Dialog
  open={openDeleteDialog}
  onClose={() => setOpenDeleteDialog(false)}
>
  <DialogTitle>
    Are you sure you want to delete "{modularToDelete?.title}"?
  </DialogTitle>
  <DialogContent>
    This action cannot be undone.
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
      Cancel
    </Button>
    <Button
      onClick={() => {
        handleDeleteModular(modularToDelete);
        setOpenDeleteDialog(false); 
      }}
      color="error"
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
};

export default Modulars;
