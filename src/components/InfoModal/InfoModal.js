import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const InfoModal = ({ open, slide, onClose }) => {
  if (!slide) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Slide Information</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Title: {slide.title}</Typography>
        <Typography variant="body1">Date Created: {new Date(slide.dateCreated).toLocaleString()}</Typography>
        <Typography variant="body1">Last Updated: {new Date(slide.lastUpdated).toLocaleString()}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
