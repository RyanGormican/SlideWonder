import React, {useState} from 'react';

import { Typography, Box, FormControl, InputLabel, Select, IconButton, Menu, MenuItem, InputAdornment, TextField, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import * as SelectUtility from './SelectUtility';

const Buttons = ({ 
  theme, setTheme, sortOrder, setSortOrder, searchQuery, setSearchQuery, 
  slides, tags, toggleTag, tagStates, toggleAllTags, uniqueTags, 
  setViewType, setSlides, setPins, setTags 
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleTagMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleTagMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleImportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      SelectUtility.handleImportJSON(file, setSlides, setPins, setTags);
    }
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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
        <TextField
          label="Search Slides"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => SelectUtility.handleSearchChange(e, setSearchQuery)}
          style={{ flexGrow: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery.length > 0 && (
                  <IconButton onClick={() => setSearchQuery('')}>
                    <Icon icon="mdi:close" width="24" height="24" />
                  </IconButton>
                )}
                {tags?.length > 0 && (
                  <div>
                    <IconButton onClick={handleTagMenuOpen}>
                      <Icon icon="mynaui:tag-solid" width="24" height="24" />
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

      

        <IconButton onClick={() => setViewType('grid')}>
          <Icon icon="mdi:grid" width="24" height="24" />
        </IconButton>
        <IconButton onClick={() => setViewType('list')}>
          <Icon icon="material-symbols:list" width="24" height="24" />
        </IconButton>
        <IconButton onClick={() => SelectUtility.handleDownloadAll()}>
          <Icon icon="mdi:download" width="24" height="24" />
        </IconButton>
        <IconButton component="label" htmlFor="importFileInput">
          <Icon icon="mdi:import" width="24" height="24" />
          <input
            type="file"
            accept="application/json"
            id="importFileInput"
            style={{ display: 'none' }}
            onChange={handleImportFileChange}
          />
        </IconButton>

        <IconButton onClick={() => SelectUtility.toggleSortOrder(setSortOrder)}>
          <Icon icon={`mdi:arrow-${sortOrder.direction === 'asc' ? 'up' : 'down'}`} width="24" height="24" />
        </IconButton>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">Sort by</Typography>
          <FormControl style={{ minWidth: '10rem', maxWidth: '10rem' }}>
            <InputLabel>Sorting Options</InputLabel>
            <Select value={sortOrder.field} label="Sort Options">
              <MenuItem value="name" onClick={() => handleSortFieldChange('name')}>
                Name
              </MenuItem>
              <MenuItem value="lastUpdated" onClick={() => handleSortFieldChange('lastUpdated')}>
                Last Updated
              </MenuItem>
              <MenuItem value="dateCreated" onClick={() => handleSortFieldChange('dateCreated')}>
                Creation Date
              </MenuItem>
              <MenuItem value="deckSize" onClick={() => handleSortFieldChange('deckSize')}>
                Deck Size
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
    </div>
  );
};

export default Buttons;
