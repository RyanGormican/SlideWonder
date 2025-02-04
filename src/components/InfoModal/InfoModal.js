import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { Icon } from '@iconify/react';

const InfoModal = ({ open, slide, fileLastModified, onClose }) => {
  if (!slide) return null;

  function getJsonSizeInKB(obj) {
  console.log(slide);
    const byteSize = new TextEncoder().encode(JSON.stringify(obj)).length;
    return (byteSize / 1024).toFixed(2); // Converts to KB
  }

  const slideLastUpdatedTimestamp = new Date(slide.lastUpdated).getTime();
  const isUpdated = fileLastModified !== null && slideLastUpdatedTimestamp < fileLastModified;

  const sizeInKB = getJsonSizeInKB(slide);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Slide Information - {slide.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Date Created: {new Date(slide.dateCreated).toLocaleString()}</Typography>
        <Typography variant="body1">Last Updated: {new Date(slide.lastUpdated).toLocaleString()}</Typography>
        <Typography variant="body1">Size: {sizeInKB} KB</Typography>
        <Typography variant="body1">
          Synced: {isUpdated ? <Icon color="green" icon="proicons:checkmark" /> : <Icon color="red" icon="iconoir:xmark" />}
        </Typography>
        <Typography variant="body1"># of Slides: {slide.deck.length}</Typography>
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
