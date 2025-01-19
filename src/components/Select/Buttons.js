import React, {useState} from 'react';

import { Grid, Card, CardContent, Typography, IconButton, Menu, MenuItem, InputAdornment, TextField, List, ListItem, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import InfoModal from '../InfoModal/InfoModal';
import * as SelectUtility from './SelectUtility';
import * as SlideManagement from './SlideManagement';
import GridView from './GridView'; 
import ListView from './ListView';

const Buttons = ({ theme,setTheme,sortOrder,setSortOrder,searchQuery,setSearchQuery,slides,tags,toggleTag,tagStates,toggleAllTags,uniqueTags,setViewType,setSlides,setPins,setTags}) => {
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
              {tags?.length>0? (
              <div>
                <IconButton onClick={handleTagMenuOpen}>
                  <Icon icon="mynaui:tag-solid" width="24" height="24" />
                </IconButton>
            </div>
                ) : ('' )}
              <Menu
  anchorEl={menuAnchor}
  open={Boolean(menuAnchor)}
  onClose={handleTagMenuClose}
>
  {/* Button to toggle all tags */}
  <MenuItem > <IconButton onClick={() => toggleAllTags(false)} > <Icon icon="iconoir:xmark" width="24" height="24" /> < /IconButton>   <IconButton onClick={() => toggleAllTags(true)} >  <Icon icon="proicons:checkmark" width="24" height="24" /> < /IconButton> </MenuItem>
  
  {/* List of individual tags */}
  {uniqueTags?.map((tag) => (
    <MenuItem
      key={tag.title}
      onClick={() => toggleTag(tag.title)}
    >
      <ListItemText
        primary={tag.title} 
      />
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

        <button 
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        style={{ border: 'none', background: 'none', cursor: 'pointer' }}
      >
        {theme === 'light' ? (
          <Icon icon="tabler:sun-filled" width="24" height="24"/>
        ) : (
          <Icon icon="tabler:moon-filled" width="24" height="24"/>
        )}
      </button>
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
    </div>
  );
};

export default Buttons;
