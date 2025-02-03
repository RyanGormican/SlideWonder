import React, { useEffect, useState, useRef } from 'react';
import { Card, CardMedia, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { renderCanvasContent } from './Canvas/CanvasRender';
import { Canvas } from 'fabric';
import { Icon } from '@iconify/react';
const Template = ({ templates, selectedTemplate, setSelectedTemplate, templatesRef, activeCategory, setActiveCategory,personalTemplates,setPersonalTemplates }) => {
  const [sortedTemplatesPersonal, setSortedTemplatesPersonal] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // For confirmation dialog
  const [templateToDelete, setTemplateToDelete] = useState(null); // Store the template to be deleted
  const personalTemplatesRef = useRef({});

  useEffect(() => {
  // Sort the templates based on text/title
  const sortedPersonal = personalTemplates?.sort((a, b) => a.text.localeCompare(b.text));
  setSortedTemplatesPersonal(sortedPersonal);

  // Iterate through each personal template and render it on the corresponding canvas
  sortedPersonal?.forEach((template) => {
    const { id, content, backgroundColor } = template;
    const canvasElement = personalTemplatesRef.current[id]; // Access the canvas ref by id

    if (canvasElement) {
      const existingCanvas = canvasElement.fabricCanvas;
      if (existingCanvas) {
        existingCanvas.dispose(); // Dispose of the old canvas if it exists
      }
      // Create a new canvas
      const newCanvas = new Canvas(canvasElement, {
        width: 150,
        height: 150,
        preserveObjectStacking: true,
        backgroundColor: backgroundColor || '#ffffff', 
      });

      // Attach the new canvas to the DOM element
      canvasElement.fabricCanvas = newCanvas;

      renderCanvasContent(newCanvas, content, 150, 150, 1);
    }
  });

  // Cleanup function to dispose of the fabric canvas instances when component unmounts or data changes
  return () => {
    Object.values(personalTemplatesRef.current).forEach((canvasElement) => {
      if (canvasElement) {
        const fabricCanvas = canvasElement.fabricCanvas;
        if (fabricCanvas) {
          fabricCanvas.dispose(); // Dispose of the canvas when cleaning up
        }
      }
    });
  };
}, [activeCategory, personalTemplates]);


  // Handle deleting a template
  const handleDeleteTemplate = (template) => {
    setTemplateToDelete(template); 
    setOpenDeleteDialog(true); 
  };

  // Confirm deletion
  const confirmDelete = () => {
    const slideWonderData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
    const updatedTemplates = slideWonderData.personaltemplates.filter(
      (template) => template.id !== templateToDelete.id
    );
    setPersonalTemplates(updatedTemplates);
    localStorage.setItem(
      'SlideWonderdata',
      JSON.stringify({ ...slideWonderData, personaltemplates: updatedTemplates })
    );


    setSortedTemplatesPersonal(updatedTemplates);

    setOpenDeleteDialog(false); 
    setTemplateToDelete(null); 
  };


  const cancelDelete = () => {
    setOpenDeleteDialog(false); 
    setTemplateToDelete(null); 
  };

  // Default templates sorted alphabetically
  const sortedTemplatesDefault = templates.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div style={{ marginBottom: '20px'}}>
        <Button onClick={() => setActiveCategory('Default')} variant={activeCategory === 'Default' ? 'contained' : 'outlined'}>
          Default
        </Button>
        <Button onClick={() => setActiveCategory('Personal')} variant={activeCategory === 'Personal' ? 'contained' : 'outlined'}>
          Personal
        </Button>
      </div>

      {/* Default Templates */}
      <div style={{ display: activeCategory === 'Default' ? 'block' : 'none' }}>
        {sortedTemplatesDefault.map((template) => (
          <div key={template.id} onClick={() => setSelectedTemplate(selectedTemplate === template ? null : template)} style={{ margin: '5px', cursor: 'pointer' }}>
            <Card style={{ display: 'flex', width: 'auto', maxHeight: '20vh', backgroundColor: selectedTemplate === template ? '#e0e0e0' : 'transparent', boxShadow: 'none', border: 'none', padding: '10px', flexDirection: 'row' }}>
              <CardMedia style={{ width: '200px', height: 'auto' }}>
                <div className="locked" style={{ width: '100%' }}>
                  <canvas ref={(el) => (templatesRef.current[template.id] = el)} style={{ width: '100%' }}></canvas>
                </div>
              </CardMedia>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" style={{ fontSize: '1rem', marginBottom: '8px' }}>
                  {template.title}
                </Typography>
                <div style={{ fontSize: '1rem', color: '#555', overflow: 'auto' }}>
                  {template.description}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Personal Templates */}
      <div style={{ display: activeCategory === 'Personal' ? 'block' : 'none' }}>
        {sortedTemplatesPersonal?.map((template) => (
          <div key={template.id}  onClick={() => setSelectedTemplate(selectedTemplate === template ? null : template)} style={{ margin: '5px', cursor: 'pointer' }}>
            <Card style={{ display: 'flex', width: 'auto', maxHeight: '20vh', backgroundColor: selectedTemplate === template ? '#e0e0e0' : 'transparent', boxShadow: 'none', border: 'none', padding: '10px', flexDirection: 'row' }}>
              <CardMedia style={{ width: '200px', height: 'auto' }}>
                <div className="locked" style={{ width: '100%' }}>
                  <canvas ref={(el) => (personalTemplatesRef.current[template.id] = el)} style={{ width: '100%' }}></canvas>
                </div>
              </CardMedia>
              <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" style={{ fontSize: '1rem', marginBottom: '8px' }}>
                  {template.text}
                </Typography>
                <div style={{ fontSize: '1rem', color: '#555', overflow: 'auto' }}>
                  {template.description}
                </div>
                <Button color="error" onClick={() => handleDeleteTemplate(template)}>
                  <Icon
      icon="mdi:trash"
      width="2rem"
      height="2rem"
      className="delete-icon"
      style={{
        color: 'red',
        cursor: 'pointer',
        background: '#fff',
        borderRadius: '50%',
        padding: '4px',
        border: '1px solid #ccc',
      }}
    />
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete "{templateToDelete?.text}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Template;
