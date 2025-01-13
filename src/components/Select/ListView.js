// ListView.js
import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import * as SelectUtility from './SelectUtility';

const ListView = ({
  sortedSlides,
  currentPageList,
  slidesPerPageList,
  handleGridClick,
  setHoveredDate,
  hoveredDate
}) => {
  const paginatedSlidesList = sortedSlides.slice((currentPageList - 1) * slidesPerPageList, currentPageList * slidesPerPageList);

  return (
    <>
      <List>
        {paginatedSlidesList.map((slide, index) => (
          <ListItem button key={index} onClick={() => handleGridClick(slide.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <ListItemText primary={slide.title} style={{ fontWeight: 'bold' }} />
              <div
                style={{ fontSize: '14px', color: '#555', marginLeft: '16px' }}
                onMouseEnter={() => setHoveredDate(prev => ({ ...prev, [slide.id]: 'created' }))}
                onMouseLeave={() => setHoveredDate(prev => ({ ...prev, [slide.id]: null }))}
              >
                <strong>Created: </strong>
                {hoveredDate[slide.id] === 'created'
                  ? SelectUtility.formatDate(slide.dateCreated)
                  : SelectUtility.timeAgo(slide.dateCreated)}
              </div>

              <div
                style={{ fontSize: '14px', color: '#555', marginLeft: '16px' }}
                onMouseEnter={() => setHoveredDate(prev => ({ ...prev, [slide.id]: 'updated' }))}
                onMouseLeave={() => setHoveredDate(prev => ({ ...prev, [slide.id]: null }))}
              >
                <strong>Last Updated: </strong>
                {hoveredDate[slide.id] === 'updated'
                  ? SelectUtility.formatDate(slide.lastUpdated)
                  : SelectUtility.timeAgo(slide.lastUpdated)}
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ListView;
