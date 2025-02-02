import React from 'react';
import { Card, CardMedia, Typography } from '@mui/material';

const Template = ({ templates, selectedTemplate, setSelectedTemplate, templatesRef }) => {
  const sortedTemplates = templates.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      {sortedTemplates.map((template) => (
        <div
          key={template.id}
          onClick={() => setSelectedTemplate(selectedTemplate === template ? null : template)}
          style={{
            margin: '5px',
            cursor: 'pointer',
          }}
        >
          <Card
            style={{
              display: 'flex',
              width: 'auto',
              maxHeight: '20vh',
              backgroundColor: selectedTemplate === template ? '#e0e0e0' : 'transparent',
              boxShadow: 'none',
              border: 'none',
              padding: '10px',
              flexDirection: 'row',
            }}
          >
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
    </>
  );
};

export default Template;
