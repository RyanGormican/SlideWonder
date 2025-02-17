import React,{useEffect} from 'react';
import { IconButton, Button, Typography, Box, Grid, Tooltip } from '@mui/material';
import { Icon } from '@iconify/react';
import * as SlideManagement from './SlideManagement';
const PaginationControls = ({ 
  currentPage, 
  slidesPerPage, 
  sortedSlides, 
  handlePageChange, 
  onAddSlide,
  slides,
  setSlides,
  view
}) => {
  useEffect(() => {
  if (currentPage > Math.ceil(sortedSlides.length / slidesPerPage)){
  handlePageChange(1);
  }

  } , [sortedSlides]);
  useEffect(() => {
    if (view !== "select") return;
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          if (currentPage > 1) handlePageChange(currentPage - 1);
          break;
        case 'ArrowRight':
          if (currentPage * slidesPerPage < sortedSlides.length) handlePageChange(currentPage + 1);
          break;
        case 'Home':
          handlePageChange(1);
          break;
        case 'End': 
          handlePageChange(Math.ceil(sortedSlides.length / slidesPerPage));
          break;
        default:
          break;
      }
    };


    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, slidesPerPage, sortedSlides, view]);

  return (
    <Box className="pagination-container" style={{ display: sortedSlides.length === 0 ? 'none' : 'block' }}>
      
      <Grid container className="pagination-grid">
        

        <Grid item xs={4} className="left-controls">
          <Tooltip title="Go to First Page" arrow>
            <IconButton 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1} 
              color="primary"
              sx={{ fontSize: '2rem' }} 
            >
              <Icon icon="material-symbols:first-page" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Go to Previous Page" arrow>
            <IconButton 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
              color="primary"
              sx={{ fontSize: '2rem' }} 
            >
              <Icon icon="mdi:arrow-left" />
            </IconButton>
          </Tooltip>
        </Grid>


        <Grid item xs={1} className="center-controls">
          {Math.ceil(sortedSlides.length / slidesPerPage) >= 1 && (
            <Typography variant="body1" className="page-indicator">
              Page {currentPage} of {Math.ceil(sortedSlides.length / slidesPerPage)}
            </Typography>
          )}
        </Grid>


        <Grid item xs={4} className="right-controls">
          <Tooltip title="Go to Next Page" arrow>
            <IconButton 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage * slidesPerPage >= sortedSlides.length} 
              color="primary"
              sx={{ fontSize: '2rem' }} 
            >
              <Icon icon="mdi:arrow-right" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Go to Last Page" arrow>
            <IconButton 
              onClick={() => handlePageChange(Math.ceil(sortedSlides.length / slidesPerPage))} 
              disabled={currentPage === Math.ceil(sortedSlides.length / slidesPerPage)} 
              color="primary"
              sx={{ fontSize: '2rem' }} 
            >
              <Icon icon="material-symbols:last-page" />
            </IconButton>
          </Tooltip>
       

        </Grid>

      </Grid>

    </Box>
  );
};

export default PaginationControls;
