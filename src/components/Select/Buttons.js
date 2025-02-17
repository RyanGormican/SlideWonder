import React, {useState} from 'react';

import { Button, Typography, Box, FormControl, InputLabel, Select, IconButton,  Tooltip, Menu, MenuItem, InputAdornment, TextField, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import * as SelectUtility from './SelectUtility';
import * as SlideManagement from './SlideManagement';
import Notifications from './Notifications';
const Buttons = ({ 
  theme, setTheme, sortOrder, setSortOrder, searchQuery, setSearchQuery, 
  slides, tags, toggleTag, tagStates, toggleAllTags, uniqueTags, 
  setViewType, setSlides, setPins, setTags,setSlidesPerView,onAddSlide, onlyPinned, setOnlyPinned 
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [notifications,setNotifications]=useState(false);
  const handleTagMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleTagMenuClose = () => {
    setMenuAnchor(null);
  };

 

  // Handle sorting directly on MenuItem click
  const handleSortFieldChange = (field) => {
    setSortOrder((prevSortOrder) => ({
      ...prevSortOrder,
      field,
    }));
    SelectUtility.changeSortField(field, setSortOrder);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center',width:'100vw', marginBottom: '16px', gap: '16px' }}>
        <TextField
          label="Search Slides "
          variant="outlined"
          value={searchQuery}
          placeholder ="Search Slides"
          onChange={(e) => SelectUtility.handleSearchChange(e, setSearchQuery)}
          style={{ flexGrow: 1 }}
          InputProps={{
           startAdornment: (
      <InputAdornment position="start">
        <Icon icon="material-symbols:search" />
      </InputAdornment>
    ),
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery.length > 0 && (
                  <IconButton onClick={() => setSearchQuery('')}>
                    <Icon icon="mdi:close"/>
                  </IconButton>
                )}
                {tags?.length > 0 && (
                  <div>
                    <IconButton onClick={handleTagMenuOpen}>
                      <Icon icon="mynaui:tag-solid" />
                    </IconButton>
                  </div>
                )}
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleTagMenuClose}>
                  {/* Button to toggle all tags */}
                  <MenuItem>
                    <IconButton onClick={() => toggleAllTags(false)}>
                      <Icon icon="iconoir:xmark" width="24" height="24" />
                    </IconButton>
                    <IconButton onClick={() => toggleAllTags(true)}>
                      <Icon icon="proicons:checkmark" width="24" height="24" />
                    </IconButton>
                  </MenuItem>

                  {/* List of individual tags */}
                  {uniqueTags?.map((tag) => (
                    <MenuItem key={tag.title} onClick={() => toggleTag(tag.title)}>
                      <ListItemText primary={tag.title} />
                      <input
                        type="checkbox"
                        checked={tagStates[tag.title]}
                        readOnly
                        style={{ marginLeft: '8px' }}
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </InputAdornment>
            ),
          }}
        />

      
 
<Tooltip title="Add New Slide" arrow>
  <IconButton 
    onClick={onAddSlide} 
    sx={{
      fontSize: '1.25rem', 
      fontWeight: 'bold', 
    }}
  >
    New Slide <Icon icon="fluent:slide-add-16-filled" />
  </IconButton>
</Tooltip>
          

     <Tooltip title="Import Slide" arrow>
  <IconButton 
    sx={{
      fontSize: '1.25rem', 
      fontWeight: 'bold', 
    }} 
    component="label"
  >
    Import Slide <Icon icon="mdi:file-upload"/>
    <input 
      type="file" 
      accept=".json" 
      hidden 
      onChange={(e) => SlideManagement.handleImportSlide(e, slides, setSlides)} 
    />
  </IconButton>
</Tooltip>



<span style={{ gap: 0, }}>
  <Tooltip title="Tag View">
    <IconButton
      onClick={() => {
        setViewType('tag');
        setSlidesPerView(9);
      }}
    >
  <Icon icon="mdi:tag"/>
    </IconButton>
</Tooltip>
  <Tooltip title="Timeline View">
    <IconButton
      onClick={() => {
        setViewType('timeline');
        setSlidesPerView(9);
      }}
    >
 <Icon icon="material-symbols:timeline"  />
    </IconButton>
</Tooltip>

  <Tooltip title="Grid View">
    <IconButton
      onClick={() => {
        setViewType('grid');
        setSlidesPerView(9);
      }}
    >
      <Icon icon="mdi:grid" />
    </IconButton>
  </Tooltip>
  <Tooltip title="Compact Grid View">
    <IconButton
      onClick={() => {
        setViewType('grid');
        setSlidesPerView(18);
      }}
    >
      <Icon icon="mdi-light:grid" />
    </IconButton>
  </Tooltip>

  <Tooltip title="List View">
    <IconButton
      onClick={() => {
        setViewType('list');
        setSlidesPerView(15);
      }}
    >
      <Icon icon="material-symbols:list" />
    </IconButton>
  </Tooltip>
</span>

<span style={{ gap: 0, }}>
<Tooltip title="Toggle Pinned Items Only">
    <IconButton
      onClick={() => {
        setOnlyPinned(!onlyPinned);
      }} >
  <Icon icon={onlyPinned ? "mdi:pin" : "mdi:pin-outline"}/>
    </IconButton>
</Tooltip>
<Tooltip title="Toggle Sorting Direction">
        <IconButton onClick={() => SelectUtility.toggleSortOrder(setSortOrder)}>
          <Icon icon={`mdi:arrow-${sortOrder.direction === 'asc' ? 'up' : 'down'}`}  />
        </IconButton>
</Tooltip>
</span>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl style={{ minWidth: '14rem', maxWidth: '14rem' }}>
            <InputLabel>Sorting Options</InputLabel>
            <Select value={sortOrder.field} label="Sort Options">
              <MenuItem value="name" onClick={() => handleSortFieldChange('name')}>
                Sort by Name
              </MenuItem>
              <MenuItem value="lastUpdated" onClick={() => handleSortFieldChange('lastUpdated')}>
                Sort by Last Updated
              </MenuItem>
              <MenuItem value="dateCreated" onClick={() => handleSortFieldChange('dateCreated')}>
                Sort by Creation Date
              </MenuItem>
              <MenuItem value="deckSize" onClick={() => handleSortFieldChange('deckSize')}>
                Sort by Deck Size
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
          <IconButton onClick={() => setNotifications((prev) => !prev)}>
            <Tooltip title="Show Notification Logs">
        <Icon icon="material-symbols:notifications"/>
        </Tooltip>
        </IconButton>
        <div style={{display: notifications ? 'block' : 'none'}}> 
        <Notifications slides={slides} setNotifications={setNotifications} notifications={notifications}/>
        </div>
      </div>
    </div>
  );
};

export default Buttons;
