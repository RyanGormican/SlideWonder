import React from 'react';
import { Box, Typography, TextField, Button, Input } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Icon } from '@iconify/react';

const ModularChart = ({selectedModular, renderHeight,renderWidth,modulars,setModulars,newChartTitle,setNewChartTitle, selectedModularId}) => {
   const addLabel = () => {
  const updatedLabels = [...selectedModular.data.labels, `Label ${selectedModular.data.labels.length + 1}`];
 const updatedDataset = selectedModular.data.datasets.map((dataset) => ({
    ...dataset,
    data: [...dataset.data, 1], 
  }));
  const updatedData = { ...selectedModular.data, labels: updatedLabels, datasets: updatedDataset};
  updateModularData(updatedData);
};

const removeLabel = (index) => {
  const updatedLabels = selectedModular.data.labels.filter((_, idx) => idx !== index);
  const updatedDatasets = selectedModular.data.datasets.map((dataset) => ({
    ...dataset,
    data: dataset.data.filter((_, idx) => idx !== index), // Remove the data point at the same index
  }));

  const updatedData = { ...selectedModular.data, labels: updatedLabels, datasets: updatedDatasets };
  updateModularData(updatedData);
};


const editLabel = (labelIndex, newLabel) => {
  const updatedLabels = selectedModular.data.labels.map((label, index) =>
    index === labelIndex ? newLabel : label
  );
  const updatedData = { ...selectedModular.data, labels: updatedLabels };
  updateModularData(updatedData);
};

// Update the selected modular with new chart data
const updateModularData = (updatedData) => {
  setModulars((prevModulars) =>
    prevModulars.map((modular) =>
      modular.id === selectedModularId ? { ...modular, data: updatedData, lastUpdated: Date.now() } : modular
    )
  );
};
const editDatasetValue = (index, newValue) => {
  const updatedData = selectedModular.data.datasets.map((dataset) => ({
    ...dataset,
    data: dataset.data.map((value, idx) => (idx === index ? parseFloat(newValue) : value)), // Update the value for this index
  }));

  // Update modular state
  updateModularData({ ...selectedModular.data, datasets: updatedData });
};
const updateModularOptions = (optionKey, newValue) => {
  setModulars((prevModulars) =>
    prevModulars.map((modular) =>
      modular.id === selectedModularId
        ? {
            ...modular,
            options: {
              ...modular.options,
              plugins: {
                ...modular.options.plugins,
                title: {
                  ...modular.options.plugins.title,
                  [optionKey]: newValue, 
                },
              },
              lastUpdated: Date.now(),
            },
            lastUpdated: Date.now(),
          }
        : modular
    )
  );
};


    return (
    <Box sx={{ display: 'flex', mb: 2 }}>
      {/* Chart Container */}
      <Box>
        <Bar
          data={selectedModular.data}
          options={selectedModular.options}
          height={renderHeight*0.75}
          width={renderWidth}
        />
      </Box>

      {/* Side Panel */}
      

        {/* Label and Dataset Management */}
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Labels and Dataset:</Typography>
            <Box sx={{ overflow: 'auto', height: '20vh' }}>
              {selectedModular.data.labels.map((label, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {/* Label text field for editing */}
                  <TextField
                    value={label}
                    onChange={(e) => editLabel(index, e.target.value)}
                    sx={{ mr: 2 }}
                    variant="outlined"
                    size="small"
                  />

                  {/* Dataset value field for editing */}
                  <Input
                    value={selectedModular.data.datasets[0].data[index]}
                    onChange={(e) => editDatasetValue(index, e.target.value)}
                    sx={{ mr: 2 }}
                    type="number"
                  />

                  {/* Remove button for both label and dataset */}
                  <Button onClick={() => removeLabel(index)} color="error" size="small">
                    <Icon icon="mdi:trash" />
                  </Button>
                </Box>
              ))}
            </Box>

            {/* Add Label Button */}
            <Button onClick={addLabel} variant="contained" color="primary" size="small">
              Add Label
            </Button>
          </Box>

          {/* Chart Title Input */}
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">Chart Title:</Typography>
            <TextField
              value={newChartTitle}
              onChange={(e) => setNewChartTitle(e.target.value)}
              onBlur={() => updateModularOptions('text', newChartTitle)}
              variant="outlined"
              size="small"
              sx={{ width: '60%' }}
            />
          </Box>
        </Box>
      </Box>
  );
};

export default ModularChart;
