import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, TextField, List, ListItem, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import InfoModal from '../InfoModal/InfoModal';
import * as SelectUtility from './SelectUtility';
import * as SlideManagement from './SlideManagement';
import GridView from './GridView'; // Ensure you import your GridView component
import ListView from './ListView'; // Ensure you import your ListView component

const Select = ({ slides, setSlides, handleGridClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [sortOrder, setSortOrder] = useState({ field: 'lastUpdated', direction: 'desc' });
  const [viewType, setViewType] = useState('grid'); // State to toggle between grid and list view
  const [hoveredDate, setHoveredDate] = useState({});
  const [currentPageGrid, setCurrentPageGrid] = useState(1);
  const [currentPageList, setCurrentPageList] = useState(1);

  // Filter slides based on search query
  const filteredSlides = slides.filter(slide =>
    slide.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort slides based on selected field and direction
  const sortedSlides = [...filteredSlides].sort((a, b) => {
    const { field, direction } = sortOrder;
    if (field === 'name') {
      return direction === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (field === 'lastUpdated') {
      return direction === 'asc'
        ? new Date(a.lastUpdated) - new Date(b.lastUpdated)
        : new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
    if (field === 'dateCreated') {
      return direction === 'asc'
        ? new Date(a.dateCreated) - new Date(b.dateCreated)
        : new Date(b.dateCreated) - new Date(a.dateCreated);
    }
    return 0;
  });

  // Pagination logic for grid view 
  const slidesPerPageGrid = 9;
  const startIndexGrid = (currentPageGrid - 1) * slidesPerPageGrid;
  const paginatedSlidesGrid = sortedSlides.slice(startIndexGrid, startIndexGrid + slidesPerPageGrid);

  // Pagination logic for list view
  const slidesPerPageList = 15;
  const startIndexList = (currentPageList - 1) * slidesPerPageList;
  const paginatedSlidesList = sortedSlides.slice(startIndexList, startIndexList + slidesPerPageList);

  const handlePageChangeGrid = (newPage) => {
    setCurrentPageGrid(newPage);
  };

  const handlePageChangeList = (newPage) => {
    setCurrentPageList(newPage);
  };

  return (
    <div>
      {/* Search bar and view toggle buttons */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
        <TextField
          label="Search Slides"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => SelectUtility.handleSearchChange(e, setSearchQuery)}
          style={{ flexGrow: 1 }}
        />
        <IconButton onClick={() => setViewType('grid')}>
          <Icon icon="mdi:grid" width="24" height="24" />
        </IconButton>
        <IconButton onClick={() => setViewType('list')}>
          <Icon icon="material-symbols:list" width="24" height="24" />
        </IconButton>
        <IconButton onClick={() => SelectUtility.handleDownloadAll(slides)}>
          <Icon icon="mdi:download" width="24" height="24" />
        </IconButton>
        <IconButton onClick={() => SelectUtility.toggleSortOrder(setSortOrder)}>
          <Icon icon={`mdi:arrow-${sortOrder.direction === 'asc' ? 'up' : 'down'}`} width="24" height="24" />
        </IconButton>
        <IconButton onClick={() => SelectUtility.changeSortField('name', setSortOrder)}>
          <Typography style={{ fontWeight: sortOrder.field === 'name' ? 'bold' : 'normal' }}>
            Sort by Name
          </Typography>
        </IconButton>
        <IconButton onClick={() => SelectUtility.changeSortField('lastUpdated', setSortOrder)}>
          <Typography style={{ fontWeight: sortOrder.field === 'lastUpdated' ? 'bold' : 'normal' }}>
            Sort by Last Updated
          </Typography>
        </IconButton>
        <IconButton onClick={() => SelectUtility.changeSortField('dateCreated', setSortOrder)}>
          <Typography style={{ fontWeight: sortOrder.field === 'dateCreated' ? 'bold' : 'normal' }}>
            Sort by Creation Date
          </Typography>
        </IconButton>
      </div>

      {/* Conditional rendering of grid or list view */}
      {viewType === 'grid' ? (
        <div>
       <GridView
  sortedSlides={sortedSlides}
  currentPageGrid={currentPageGrid}
  slidesPerPageGrid={slidesPerPageGrid}
  handleGridClick={handleGridClick}
  editingTitle={editingTitle}
  newTitle={newTitle}
  setNewTitle={setNewTitle}
  slides={slides}
  setEditingTitle={setEditingTitle}
  setSlides={setSlides}
  setSelectedSlide={setSelectedSlide}
/>


          {/* Pagination controls with Add Slide button */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChangeGrid(currentPageGrid - 1)}
                disabled={currentPageGrid === 1}
                style={{ marginRight: '16px' }}
              >
                Previous
              </button>

              {/* Add Slide Button */}
              <IconButton onClick={() => SlideManagement.handleAddSlide(slides, setSlides)} style={{ margin: '0 16px' }}>
                New Slide
              </IconButton>

              <button
                onClick={() => handlePageChangeGrid(currentPageGrid + 1)}
                disabled={currentPageGrid * slidesPerPageGrid >= sortedSlides.length}
                style={{ marginLeft: '16px' }}
              >
                Next
              </button>
            </div>

            {/* Page indicator */}
            {Math.ceil(sortedSlides.length / slidesPerPageGrid) >= 1 && (
              <Typography variant="body1" style={{ marginTop: '8px' }}>
                Page {currentPageGrid} of {Math.ceil(sortedSlides.length / slidesPerPageGrid)}
              </Typography>
            )}
          </div>
        </div>
      ) : (
        <div>
         <ListView
  sortedSlides={sortedSlides}
  currentPageList={currentPageList}
  slidesPerPageList={slidesPerPageList}
  handleGridClick={handleGridClick}
  setHoveredDate={setHoveredDate}
  hoveredDate={hoveredDate}
/>

          {/* Pagination controls with Add Slide button */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChangeList(currentPageList - 1)}
                disabled={currentPageList === 1}
                style={{ marginRight: '16px' }}
              >
                Previous
              </button>

              {/* Add Slide Button */}
              <IconButton onClick={() => SlideManagement.handleAddSlide(slides, setSlides)} style={{ height: '4vh' }}>
                New Slide
              </IconButton>

              <button
                onClick={() => handlePageChangeList(currentPageList + 1)}
                disabled={currentPageList * slidesPerPageList >= sortedSlides.length}
                style={{ marginLeft: '16px' }}
              >
                Next
              </button>
            </div>

            {/* Page indicator */}
            {Math.ceil(sortedSlides.length / slidesPerPageList) >= 1 && (
              <Typography variant="body1">
                Page {currentPageList} of {Math.ceil(sortedSlides.length / slidesPerPageList)}
              </Typography>
            )}
          </div>
        </div>
      )}

      <InfoModal open={Boolean(selectedSlide)} slide={selectedSlide} onClose={() => setSelectedSlide(null)} />
    </div>
  );
};

export default Select;
