import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, TextField, Menu, MenuItem } from '@mui/material';
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
  setSelectedSlide,
  pins,
  setPins
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSlide, setSelectedSlideState] = useState(null);

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
        {paginatedSlidesGrid?.map((slide, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleGridClick(slide.id)}>
              <CardContent>
                <Typography variant="h6"></Typography>
                <div style={{ minHeight: 120, maxHeight: 120, overflowY: 'auto' }}></div>
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
                <Icon  onClick={() => SlideManagement.togglePin(slide.id, pins, setPins, slides, setSlides)} icon={pins.includes(slide.id) ? "mdi:pin" : "mdi:pin-outline"}  width="24" height="24" />
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
