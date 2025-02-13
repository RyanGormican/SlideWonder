import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import * as SlideManagement from './SlideManagement';
import * as SelectUtility from './SelectUtility';

const Details = ({ slide, pins, setPins, slides, setSlides, tags, setTags, setSelectedSlide }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tagsAnchorEl, setTagsAnchorEl] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [tagId, setTagId] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteSlideId, setDeleteSlideId] = useState(null);

  const handleClickDots = (event) => {
    setAnchorEl(event.currentTarget);
    setTagId(slide.id);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDownload = () => {
    SelectUtility.handleDownloadJSON(slide);
    handleCloseMenu();
  };

  const handleDuplicate = () => {
    SlideManagement.handleDuplicateSlide(slide, slides, setSlides);
    handleCloseMenu();
  };

  const handleDeleteClick = () => {
    setDeleteSlideId(slide.id);
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleDelete = () => {
    SlideManagement.handleDeleteSlide(deleteSlideId, slides, setSlides);
    setOpenDeleteDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClickTags = (event) => {
    setTagsAnchorEl(event.currentTarget);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <IconButton onClick={() => SlideManagement.togglePin(slide.id, pins, setPins, slides, setSlides)} sx={{ boxShadow: 'none' }}>
        <Icon icon={pins?.includes(slide.id) ? "mdi:pin" : "mdi:pin-outline"} />
      </IconButton>

      <IconButton onClick={() => SelectUtility.handleInfoClick(slide, setSelectedSlide)} sx={{ boxShadow: 'none' }}>
        <Icon icon="material-symbols:info" />
      </IconButton>

      <IconButton onClick={handleClickDots} sx={{ boxShadow: 'none' }}>
        <Icon icon="tabler:dots" />
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
      >
        <MenuItem onClick={handleDownload}>
          <Icon icon="mdi:download" style={{ marginRight: '8px' }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleDuplicate}>
          <Icon icon="humbleicons:duplicate" style={{ marginRight: '8px' }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Icon icon="mdi:trash" style={{ marginRight: '8px' }} />
          Delete
        </MenuItem>
        <MenuItem onClick={handleClickTags}>
          <Icon icon="mynaui:tag-solid" style={{ marginRight: '8px' }} />
          Tags
        </MenuItem>
      </Menu>

      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this slide?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(tagsAnchorEl)}
        onClose={() => setTagsAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem>
          <TextField
            label="Add Tag"
            variant="outlined"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            fullWidth
            autoFocus
          />
          <IconButton onClick={() => {
            SlideManagement.addTag(slide.id, newTag, tags, setTags, slides, setSlides);
            setNewTag('');
          }} sx={{ boxShadow: 'none' }}>
            Add Tag
          </IconButton>
        </MenuItem>

        {tags?.filter(tag => tag.id === slide.id).map(tag => (
          tag.titles.map((title, index) => (
            <MenuItem key={index}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2">{title}</Typography>
                <IconButton onClick={() => {
                  SlideManagement.deleteTag(slide.id, title, tags, setTags);
                }} sx={{ boxShadow: 'none' }}>
                  <Icon icon="mdi:trash" />
                </IconButton>
              </div>
            </MenuItem>
          ))
        ))}
      </Menu>
    </div>
  );
};

export default Details;
