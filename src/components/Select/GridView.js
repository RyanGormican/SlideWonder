// GridView.js
import React from 'react';
import { Grid, Card, CardContent, Typography, IconButton, TextField } from '@mui/material';
import { Icon } from '@iconify/react';
import * as SelectUtility from './SelectUtility';
import * as SlideManagement from './SlideManagement';

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
  setSelectedSlide
}) => {

  const paginatedSlidesGrid = sortedSlides?.slice((currentPageGrid - 1) * slidesPerPageGrid, currentPageGrid * slidesPerPageGrid);
  return (
    <>
      <Grid container spacing={2}>
        {paginatedSlidesGrid?.map((slide, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleGridClick(slide.id)}>
              <CardContent>
                <Typography variant="h6"></Typography>
                <div style={{ minHeight: 140, maxHeight: 140, overflowY: 'auto' }}></div>
              </CardContent>
            </Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {editingTitle === slide.title ? (
                <TextField
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => SlideManagement.handleSaveTitle(slide, slides, setEditingTitle, newTitle)}
                  autoFocus
                />
              ) : (
                <Typography
                  variant="h6"
                  onClick={() => SelectUtility.handleTitleClick(slide, setEditingTitle, setNewTitle)}
                  style={{ cursor: 'pointer' }}
                >
                  {slide.title}
                </Typography>
              )}
              <IconButton onClick={() => SelectUtility.handleDownloadCSV(slide)}>
                <Icon icon="mdi:download" width="24" height="24" />
              </IconButton>
              <IconButton onClick={() => SelectUtility.handleInfoClick(slide, setSelectedSlide)}>
                <Icon icon="material-symbols:info" width="24" height="24" />
              </IconButton>
              <IconButton onClick={(e) => { e.stopPropagation(); SlideManagement.handleDeleteSlide(slide.id, slides, setSlides); }}>
                <Icon icon="mdi:trash" width="24" height="24" />
              </IconButton>
            </div>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default GridView;
