import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { Icon } from '@iconify/react';
const InfoModal = ({ open, slide, fileLastModified, onClose }) => {
  if (!slide) return null;

  function getObjectSize(obj) {
  let bytes = 0;

  function calculate(obj) {
    if (obj === null || obj === undefined) return 0;
    if (typeof obj === 'boolean') return 4;
    if (typeof obj === 'number') return 8;
    if (typeof obj === 'string') return obj.length * 2;
    if (typeof obj === 'object') {
      let objectSize = 0;
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          objectSize += calculate(obj[key]);
        }
      }
      return objectSize;
    }
    return 0;
  }

  bytes = calculate(obj);
  return bytes;
}
  const slideLastUpdatedTimestamp = new Date(slide.lastUpdated).getTime();
  const isUpdated = fileLastModified !== null && slideLastUpdatedTimestamp  < fileLastModified;
const sizeInBytes = getObjectSize(slide);
const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Slide Information - {slide.title} </DialogTitle>
      <DialogContent>
        <Typography variant="body1">Date Created: {new Date(slide.dateCreated).toLocaleString()}</Typography>
        <Typography variant="body1">Last Updated: {new Date(slide.lastUpdated).toLocaleString()}</Typography>
        <Typography variant="body1">Size {sizeInKB} KB Synced: {isUpdated ? <Icon color="green" icon="proicons:checkmark" /> : <Icon color="red" icon="iconoir:xmark" />} </Typography>
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
