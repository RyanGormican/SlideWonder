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
  const [sortOrder, setSortOrder] = useState({ field: 'name', direction: 'asc' });
  const [viewType, setViewType] = useState('grid'); // State to toggle between grid and list view

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
    const header = slide.columns.map(col => col.title).join(',');
    const rows = slide.rows.map(row => 
      slide.columns.map(col => row[col.key] || '').join(',')
    ).join('\n');

    return `${header}\n${rows}`;
  };

  // Function to download CSV
  const handleDownloadCSV = (slide) => {
    const csvData = convertToCSV(slide);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${slide.title}.csv`);
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
          <Icon icon={`mdi:arrow-${sortOrder.direction === 'asc' ? 'down' : 'up'}`} width="24" height="24" />
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
        <Grid container spacing={2}>
          {sortedSlides.map((slide, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card onClick={() => handleGridClick(slide.id)}>
                <CardContent>
                  <Typography variant="h6"></Typography>
                  <div style={{ minHeight:150, maxHeight: 150, overflowY: 'auto' }}>
                   
                     
                  </div>
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

          <Grid item xs={12} sm={6} md={4} key="add-slide">
            <Card onClick={handleAddSlide} style={{ cursor: 'pointer' }}>
              <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 95, maxHeight: 95 }}>
                <Typography variant="h4"><Icon icon="mdi:plus" width="24" height="24" /></Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <List>
          {sortedSlides.map((slide, index) => (
            <ListItem button key={index} onClick={() => handleGridClick(slide.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                {/* Title Section */}
                <ListItemText 
                  primary={slide.title}
                  style={{ fontWeight: 'bold' }}
                />

                {/* Creation Date Section */}
                <div style={{ fontSize: '14px', color: '#555', marginLeft: '16px' }}>
                  <strong>Created: </strong>{new Date(slide.dateCreated).toLocaleDateString()}
                </div>

                {/* Last Updated Date Section */}
                <div style={{ fontSize: '14px', color: '#555', marginLeft: '16px' }}>
                  <strong>Last Updated: </strong>{new Date(slide.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </ListItem>
          ))}
        </List>
      )}

      <InfoModal
        open={Boolean(selectedSlide)}
        slide={selectedSlide}
        onClose={() => setSelectedSlide(null)}
      />
    </div>
  );
};

export default Select;
