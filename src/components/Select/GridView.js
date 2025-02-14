import React, { useState, useEffect, useRef } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, TextField, Menu, MenuItem } from '@mui/material';
import { Icon } from '@iconify/react';
import * as SelectUtility from './SelectUtility';
import * as SlideManagement from './SlideManagement';
import { renderCanvasContent } from '../Slide/Canvas/CanvasRender'; 
import { Canvas } from 'fabric';
import Details from './Details';
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
  setPins,
  tags,
  setTags,
  view
}) => {
  const [selectedSlide, setSelectedSlideState] = useState(null);
  const canvasRefs = useRef({});
  const HEIGHT = 0.134407174;
  const WIDTH = 0.315;


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
        const parentGridItem = canvasElement.closest(".locked");

         const parentWidth = parentGridItem?.offsetWidth || 0;
      if (deckItem) { 
        // If deck[0] exists, render the content for that item
        const newFabricCanvas = new Canvas(canvasElement, {
          width:parentWidth,
          height: canvasElement.height,
          preserveObjectStacking: true,
          backgroundColor: deckItem.backgroundColor,
        });
   
        // Save the fabricCanvas instance to the canvas element for later disposal
        canvasElement.fabricCanvas = newFabricCanvas;
        renderCanvasContent(newFabricCanvas, deckItem.content,parentWidth, canvasElement.height,1);
      } else {
        // If deck[0] does not exist, clear the canvas (render blank)
        const context = canvasElement.getContext('2d');
        context.clearRect(0, 0, parentWidth,  canvasElement.height); // Clear the canvas
                context.fillStyle = 'white';
  context.fillRect(0, 0, parentWidth, canvasElement.height); 
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
}, [sortedSlides, slides,currentPageGrid,view,slidesPerPageGrid]); 



  const paginatedSlidesGrid = sortedSlides?.slice((currentPageGrid - 1) * slidesPerPageGrid, currentPageGrid * slidesPerPageGrid);

  return (
    <>
      <Grid container spacing={2}>
        {paginatedSlidesGrid?.map((slide) => (
          <Grid item xs={12} sm={6} md={slidesPerPageGrid === 18 ? 2 : 4} key={slide.id}>
            <Card onClick={() => handleGridClick(slide.id)} sx={{
    borderRadius: '1rem',
    boxShadow:'0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.3)',
      transform: 'translateY(-2px)',
    }
  }}>
              <CardContent>
              <div className="locked">
                <canvas
                  ref={(el) => (canvasRefs.current[slide.id] = el)} 
                />
                </div>
              </CardContent>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px',
    borderRadius: '0 0 12px 12px', }}>
              {editingTitle === slide.title ? (
                <TextField
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => SlideManagement.handleSaveTitle(slide, slides, setSlides, setEditingTitle, newTitle)}
                  autoFocus
                  style={{ flexGrow: 1, marginRight: '12px', '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
        }, }}
                />
              ) : (
                <Typography
                  variant="h6"
                  onClick={() => SelectUtility.handleTitleClick(slide, setEditingTitle, setNewTitle)}
                  style={{ cursor: 'pointer', flexGrow: 1, fontSize: '1rem',
        fontWeight: 600,
        padding: '4px 8px',
        transition: 'color 0.2s ease-in-out', }}
                >
                <h6>
                  {slide.title}
                </h6>
                </Typography>
              )}
            <Details slide={slide} pins={pins} setPins={setPins} slides={slides} setSlides={setSlides} tags={tags} setTags={setTags} setSelectedSlide={setSelectedSlide}/>
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default GridView;

