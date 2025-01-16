import React, { useState, useEffect, useRef } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, TextField, Menu, MenuItem } from '@mui/material';
import { Icon } from '@iconify/react';
import * as SelectUtility from './SelectUtility';
import * as SlideManagement from './SlideManagement';
import { renderCanvasContent } from '../Slide/CanvasRender'; 
import { Canvas } from 'fabric';
const GridView = ({ 
  slides, 
  sortedSlides, 
  currentPageGrid, 
  slidesPerPageGrid, 
  handleGridClick, 
  editingTitle, 
  newTitle, 
  setNewTitle, 
  setEditingTitle, 
  setSlides,
  setSelectedSlide,
  pins,
  setPins
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSlide, setSelectedSlideState] = useState(null);
  const canvasRefs = useRef({});
  const HEIGHT = 0.134407174;
  const WIDTH = 0.3880;


useEffect(() => {
  // Render content on canvas for each slide when the sortedSlides change
  sortedSlides.forEach((slide) => {
    const canvasElement = canvasRefs.current[slide.id];
    
    // Find the corresponding slide in the 'slides' array
    const slideData = slides.find(s => s.id === slide.id);
    const deckItem = slideData?.deck && slideData.deck[0]; // Check if deck[0] exists
    
    if (canvasElement) {
      const fabricCanvas = canvasElement.fabricCanvas; // Access fabric canvas instance if it exists
      
      // If a canvas instance already exists, dispose of it first before creating a new one
      if (fabricCanvas) {
        fabricCanvas.dispose(); // Dispose the previous fabric canvas instance
      }

      if (deckItem) {
        // If deck[0] exists, render the content for that item
        const newFabricCanvas = new Canvas(canvasElement, {
          width: window.innerWidth * WIDTH,
          height: window.innerHeight * HEIGHT,
          preserveObjectStacking: true,
          backgroundColor: deckItem.backgroundColor,
        });

        // Save the fabricCanvas instance to the canvas element for later disposal
        canvasElement.fabricCanvas = newFabricCanvas;

        renderCanvasContent(newFabricCanvas, deckItem.content, window.innerWidth * WIDTH,  window.innerHeight * HEIGHT);
      } else {
        // If deck[0] does not exist, clear the canvas (render blank)
        const context = canvasElement.getContext('2d');
        context.clearRect(0, 0, canvasElement.width, canvasElement.height); // Clear the canvas
      }
    }
  });
  
  // Cleanup function to dispose of the previous canvas instances
  return () => {
    // Dispose of each fabric canvas when the component unmounts or when slides change
    sortedSlides.forEach((slide) => {
      const canvasElement = canvasRefs.current[slide.id];
      if (canvasElement) {
        const fabricCanvas = canvasElement.fabricCanvas; // Access fabric canvas instance
        if (fabricCanvas) {
          fabricCanvas.dispose(); // Dispose the fabric canvas instance
        }
      }
    });
  };
}, [sortedSlides, slides]); 


  const handleClickDots = (event, slide) => {
    setAnchorEl(event.currentTarget);
    setSelectedSlideState(slide);  
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDownload = () => {
    SelectUtility.handleDownloadCSV(selectedSlide);
    handleCloseMenu();
  };

  const handleDuplicate = () => {
    SlideManagement.handleDuplicateSlide(selectedSlide, slides, setSlides);
    handleCloseMenu();
  };

  const handleDelete = () => {
    SlideManagement.handleDeleteSlide(selectedSlide.id, slides, setSlides);
    handleCloseMenu();
  };

  const paginatedSlidesGrid = sortedSlides?.slice((currentPageGrid - 1) * slidesPerPageGrid, currentPageGrid * slidesPerPageGrid);

  return (
    <>
      <Grid container spacing={2}>
        {paginatedSlidesGrid?.map((slide) => (
          <Grid item xs={12} sm={6} md={4} key={slide.id}>
            <Card onClick={() => handleGridClick(slide.id)}>
              <CardContent>
              <div className="locked">
                <canvas
                  ref={(el) => (canvasRefs.current[slide.id] = el)} 
                />
                </div>
              </CardContent>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
              {editingTitle === slide.title ? (
                <TextField
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => SlideManagement.handleSaveTitle(slide, slides, setSlides, setEditingTitle, newTitle)}
                  autoFocus
                  style={{ flexGrow: 1, marginRight: '16px' }}
                />
              ) : (
                <Typography
                  variant="h6"
                  onClick={() => SelectUtility.handleTitleClick(slide, setEditingTitle, setNewTitle)}
                  style={{ cursor: 'pointer', flexGrow: 1 }}
                >
                  {slide.title}
                </Typography>
              )}

              {/* Pin icon */}
              <IconButton sx={{ boxShadow: 'none' }}>
                <Icon  onClick={() => SlideManagement.togglePin(slide.id, pins, setPins, slides, setSlides)} icon={pins?.includes(slide.id) ? "mdi:pin" : "mdi:pin-outline"}  width="24" height="24" />
              </IconButton>
              {/* Info icon */}
              <IconButton onClick={() => SelectUtility.handleInfoClick(slide, setSelectedSlide)} sx={{ boxShadow: 'none' }}>
                <Icon icon="material-symbols:info" width="24" height="24" />
              </IconButton>
              {/* Dots icon - opens the menu */}
              <IconButton onClick={(e) => handleClickDots(e, slide)} sx={{ boxShadow: 'none' }}>
                <Icon icon="tabler:dots" width="24" height="24" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
               className="dropdown"
              >
                <MenuItem onClick={handleDownload}>
                  <Icon  icon="mdi:download" width="24" height="24" style={{ marginRight: '8px' }} />
                  Download
                </MenuItem>
                <MenuItem onClick={handleDuplicate}>
                  <Icon icon="humbleicons:duplicate" width="24" height="24" style={{ marginRight: '8px' }} />
                  Duplicate
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <Icon icon="mdi:trash" width="24" height="24" style={{ marginRight: '8px' }} />
                  Delete
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default GridView;
