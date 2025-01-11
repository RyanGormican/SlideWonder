import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, IconButton, TextField, List, ListItem, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import { saveSlideToLocalStorage } from '../Helper';
import InfoModal from '../InfoModal/InfoModal';
import { saveAs } from 'file-saver'; // To help with file download
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

  const handleAddSlide = () => {
    const currentDate = new Date().toISOString();
    const currentTimestamp = Date.now();
    const newSlide = {
      title: `New Slide ${slides.length + 1}`,
      deck: [], 
      id: currentTimestamp,
      dateCreated: currentDate,
      lastUpdated: currentDate,
    };
    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    saveSlideToLocalStorage(updatedSlides);
  };

  const handleDeleteSlide = (slideId) => {
    const updatedSlides = slides.filter(slide => slide.id !== slideId);
    setSlides(updatedSlides);
    saveSlideToLocalStorage(updatedSlides);
  };

  const handleSaveTitle = (slide) => {
    const updatedSlides = slides.map(slideItem =>
      slideItem.title === slide.title ? { ...slideItem, title: newTitle } : slideItem
    );
    setSlides(updatedSlides);
    setEditingTitle(null);
    saveSlideToLocalStorage(updatedSlides);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTitleClick = (slide) => {
    setEditingTitle(slide.title);
    setNewTitle(slide.title);
  };

  const handleTitleChange = (event, slide) => {
    const updatedSlides = slides.map(s =>
      s.title === slide.title ? { ...s, title: event.target.value } : s
    );
    setSlides(updatedSlides);
    saveSlideToLocalStorage(updatedSlides);
  };

  const handleInfoClick = (slide) => {
    setSelectedSlide(slide);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const changeSortField = (field) => {
    setSortOrder((prev) => ({
      ...prev,
      field,
      direction: 'asc', // Reset direction to ascending when changing the field
    }));
  };
  // Function to convert slide data to CSV
const convertToCSV = (slide) => {
  // Check if slide is a valid object
  if (!slide || typeof slide !== 'object') {
    console.error('Invalid slide data');
    return ''; // Return an empty string if the slide is invalid
  }

  // Create header row based on the slide's properties
  const header = Object.keys(slide).join(',');

  // Create row from slide values
  const row = Object.values(slide).map(value => {
    // If the value is an object or array, convert it to a string 
    return typeof value === 'object' ? JSON.stringify(value) : value;
  }).join(',');

  return `${header}\n${row}`;
};



  // Function to download CSV
  const handleDownloadCSV = (slide) => {
    const csvData = convertToCSV(slide);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${slide.title}.csv`);
  };
const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date); // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};

  const formatDate = (date) => {
    return new Date(date).toLocaleString(); 
  };

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
        onChange={handleSearchChange}
        style={{ flexGrow: 1 }}
      />
      <IconButton onClick={() => setViewType('grid')}>
        <Icon icon="mdi:grid" width="24" height="24" />
      </IconButton>
      <IconButton onClick={() => setViewType('list')}>
        <Icon icon="material-symbols:list" width="24" height="24" />
      </IconButton>

      <IconButton onClick={toggleSortOrder}>
        <Icon icon={`mdi:arrow-${sortOrder.direction === 'asc' ? 'up' : 'down'}`} width="24" height="24" />
      </IconButton>
      <IconButton onClick={() => changeSortField('name')}>
        <Typography style={{ fontWeight: sortOrder.field === 'name' ? 'bold' : 'normal' }}>
          Sort by Name
        </Typography>
      </IconButton>
      <IconButton onClick={() => changeSortField('lastUpdated')}>
        <Typography style={{ fontWeight: sortOrder.field === 'lastUpdated' ? 'bold' : 'normal' }}>
          Sort by Last Updated
        </Typography>
      </IconButton>
      <IconButton onClick={() => changeSortField('dateCreated')}>
        <Typography style={{ fontWeight: sortOrder.field === 'dateCreated' ? 'bold' : 'normal' }}>
          Sort by Creation Date
        </Typography>
      </IconButton>
    </div>

    {/* Conditional rendering of grid or list view */}
    {viewType === 'grid' ? (
      <>
        <Grid container spacing={2}>
          {paginatedSlidesGrid.map((slide, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card onClick={() => handleGridClick(slide.id)}>
                <CardContent>
                  <Typography variant="h6"></Typography>
                  <div style={{ minHeight: 150, maxHeight: 150, overflowY: 'auto' }}></div>
                </CardContent>
              </Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {editingTitle === slide.title ? (
                  <TextField
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={() => handleSaveTitle(slide)}
                    autoFocus
                  />
                ) : (
                  <Typography
                    variant="h6"
                    onClick={() => handleTitleClick(slide)}
                    style={{ cursor: 'pointer' }}
                  >
                    {slide.title}
                  </Typography>
                )}
                <IconButton onClick={() => handleDownloadCSV(slide)}>
                  <Icon icon="mdi:download" width="24" height="24" />
                </IconButton>
                <IconButton onClick={() => handleInfoClick(slide)}>
                  <Icon icon="material-symbols:info" width="24" height="24" />
                </IconButton>
                <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteSlide(slide.id); }}>
                  <Icon icon="mdi:trash" width="24" height="24" />
                </IconButton>
              </div>
            </Grid>
          ))}
        </Grid>

        {/* Pagination controls with Add Slide button */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
          <button
            onClick={() => handlePageChangeGrid(currentPageGrid - 1)}
            disabled={currentPageGrid === 1}
            style={{ marginRight: '16px' }}
          >
            Previous
          </button>

          {/* Add Slide Button */}
          <IconButton onClick={handleAddSlide} style={{ margin: '0 16px' }}>
              New Slide
          </IconButton>
          
          <button
            onClick={() => handlePageChangeGrid(currentPageGrid + 1)}
            disabled={currentPageGrid * slidesPerPageGrid >= sortedSlides.length}
            style={{ marginLeft: '16px' }}
          >
            Next
          </button>

         {/* Page indicator */}
          <Typography variant="body1" style={{ margin: '0 16px' }}>
            Page {currentPageGrid} of {Math.ceil(sortedSlides.length / slidesPerPageGrid)}
          </Typography>
        </div>
      </>
    ) : (
      <>
        <List>
          {paginatedSlidesList.map((slide, index) => (
            <ListItem button key={index} onClick={() => handleGridClick(slide.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <ListItemText primary={slide.title} style={{ fontWeight: 'bold' }} />
                <div
                  style={{ fontSize: '14px', color: '#555', marginLeft: '16px' }}
                  onMouseEnter={() => setHoveredDate(prev => ({ ...prev, [slide.id]: 'created' }))}
                  onMouseLeave={() => setHoveredDate(prev => ({ ...prev, [slide.id]: null }))}
                >
                  <strong>Created: </strong>
                  {hoveredDate[slide.id] === 'created'
                    ? formatDate(slide.dateCreated)
                    : timeAgo(slide.dateCreated)}
                </div>

                <div
                  style={{ fontSize: '14px', color: '#555', marginLeft: '16px' }}
                  onMouseEnter={() => setHoveredDate(prev => ({ ...prev, [slide.id]: 'updated' }))}
                  onMouseLeave={() => setHoveredDate(prev => ({ ...prev, [slide.id]: null }))}
                >
                  <strong>Last Updated: </strong>
                  {hoveredDate[slide.id] === 'updated'
                    ? formatDate(slide.lastUpdated)
                    : timeAgo(slide.lastUpdated)}
                </div>
              </div>
            </ListItem>
          ))}
        </List>

        {/* Pagination controls with Add Slide button */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px' }}>
          <button
            onClick={() => handlePageChangeList(currentPageList - 1)}
            disabled={currentPageList === 1}
            style={{ marginRight: '16px' }}
          >
            Previous
          </button>

          {/* Add Slide Button in the center */}
          <IconButton onClick={handleAddSlide} style={{ margin: '0 16px' }}>
            New Slide
          </IconButton>

        

          <button
            onClick={() => handlePageChangeList(currentPageList + 1)}
            disabled={currentPageList * slidesPerPageList >= sortedSlides.length}
            style={{ marginLeft: '16px' }}
          >
            Next
          </button>

          {/* Page indicator */}
          <Typography variant="body1" style={{ margin: '0 16px' }}>
            Page {currentPageList} of {Math.ceil(sortedSlides.length / slidesPerPageList)}
          </Typography>
        </div>
      </>
    )}

    <InfoModal open={Boolean(selectedSlide)} slide={selectedSlide} onClose={() => setSelectedSlide(null)} />
  </div>
);


};

export default Select;
