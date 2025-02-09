import React, { useState } from 'react';
import * as SelectUtility from '../Select/SelectUtility';
import { Typography, Box, IconButton, Stack, Button, Tooltip, Tabs, Tab, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Icon } from '@iconify/react';

const Settings = ({ slides,setSlides,setPins,setTags,theme, setSettings,setPersonalTemplates }) => {

  const [selectedSection, setSelectedSection] = useState('DATA');
  const [openDialog, setOpenDialog] = useState(false);

  const handleImportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      SelectUtility.handleImportJSON(file, setSlides, setPins, setTags);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedSection(newValue);
  };

 const handleClearLocalStorage = () => {

  const savedData = {
    slides: [
      {
        title: 'New Slide',
        deck: [],
        id: Date.now(),
        dateCreated: Date.now(),
        lastUpdated: Date.now(),
      },
    ],
    pins: [],
    tags: [],
    settings: [
      {
        theme: 'light',
      },
    ],
    personalTemplates: [],
    downloadedtemplates: [],
    modulars:[],
  };


  localStorage.setItem('SlideWonderdata', JSON.stringify(savedData));

  setSlides(savedData.slides);
  setPins(savedData.pins);
  setTags(savedData.tags);
  setSettings(savedData.settings);
  setPersonalTemplates(savedData.personaltemplates);

  setOpenDialog(false);
};


  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 3,
        overflow: 'auto',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {/* Tabs for sections */}
             <Paper sx={{ padding: 2, width: '100%', mt: 2 }}>
      <Tabs
        value={selectedSection}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        aria-label="settings sections"
      >
        <Tab label="DATA" value="DATA" />
        <Tab label="THEME" value="THEME" />
        <Tab label="OTHER" value="OTHER" />
      </Tabs>
      </Paper>
      {/* Conditional Rendering of Sections */}
      {selectedSection === 'DATA' && (
        <Paper sx={{ padding: 2, width: '100%', mt: 2 }}>
          <Stack direction="column" spacing={3} alignItems="center">
            {/* Download Button */}
            <Tooltip title="Download SlideWonder Data" arrow>
              <Button
                onClick={() => SelectUtility.handleDownloadAll()}
                variant="contained"
                color="primary"
                startIcon={<Icon icon="mdi:download"  />}
                sx={{ width: '70%', maxWidth: '15vw', fontSize: '1.2rem' }}
              >
                Download Data
              </Button>
            </Tooltip>

            {/* Import Button */}
            <Tooltip title="Import SlideWonder Data" arrow>
              <Button
                component="label"
                variant="contained"
                color="secondary"
                startIcon={<Icon icon="mdi:import"/>}
                sx={{ width: '70%',maxWidth: '15vw', fontSize: '1.2rem' }}
              >
                Import Data
                <input
                  type="file"
                  accept="application/json"
                  id="importFileInput"
                  style={{ display: 'none' }}
                  onChange={handleImportFileChange}
                />
              </Button>
            </Tooltip>
          </Stack>
        </Paper>
      )}
           
          {selectedSection === 'THEME' && (
  <Paper sx={{ padding: 2,width: '100%', mt: 2 }}>
    <Stack direction="column" spacing={3} alignItems="center">
      <Tooltip title="Set Light Mode" arrow>
        <button
          onClick={() => setSettings('light')}
          style={{ border: 'none',width:'100%', background: 'none', cursor: 'pointer', backgroundColor:'white', color: 'black'}}
        >
          <div>
            <Icon icon="tabler:sun-filled" width="3.13vw" height="4vh" color="black" /> Light Mode
          </div>
        </button>
      </Tooltip>
      <Tooltip title="Set Dark Mode" arrow>
        <button
          onClick={() => setSettings('dark')}
          style={{ border: 'none', width:'100%', background: 'none', cursor: 'pointer', backgroundColor:'black', color: 'white'}}
        >
          <div>
            <Icon icon="tabler:moon-filled" width="3.13vw" height="4vh" color="white"/> Dark Mode
          </div>
        </button>
      </Tooltip>
    </Stack>
  </Paper>
)}

          
      
      {selectedSection === 'OTHER' && (
        <Paper sx={{ padding: 2, width: '100%', mt: 2 }}>
          <Stack direction="column" spacing={3} alignItems="center">
             <Tooltip title="Clear Local Storage" arrow>
              <Button
                variant="contained"
                color="error"
                startIcon={<Icon icon="mdi:broom" />}
                sx={{ width: '70%', maxWidth: '15vw', fontSize: '1.2rem' }}
                onClick={() => setOpenDialog(true)}
              >
                Clear Data
              </Button>
            </Tooltip>
          </Stack>
        </Paper>
      )}

      {/* Clear Data Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Clear Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to clear local storage? All unsynced and not downloaded data will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearLocalStorage} color="error">
            Clear Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
