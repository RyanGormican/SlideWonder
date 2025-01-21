import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from '@mui/material';

const NotesModal = ({ open, onClose, canvasId, currentSlide, updateSlideData }) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    const canvasToEdit = currentSlide.deck.find((canvas) => canvas.id === canvasId);
    if (canvasToEdit) {
      setNote(canvasToEdit?.note?.join('\n') || ''); 
    }
  }, [canvasId, currentSlide]);

  const handleNoteChange = (newNote) => {
    setNote(newNote);

    const updatedDeck = currentSlide.deck.map((canvas) => {
      if (canvas.id === canvasId) {
        return { ...canvas, note: newNote.split('\n') }; 
      }
      return canvas;
    });

    const updatedSlide = {
      ...currentSlide,
      deck: updatedDeck,
    };

    updateSlideData(updatedSlide);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Notes</DialogTitle>
      <DialogContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '400px',
          minHeight: '250px',
        }}
      >
        <TextField
          multiline
          rows={6}
          variant="outlined"
          label="Write your notes here"
          value={note}
          onChange={(e) => handleNoteChange(e.target.value)}
          style={{
            width: '100%',
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesModal;
