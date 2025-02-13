// ListView.js
import React, { useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import * as SelectUtility from './SelectUtility';
import Details from './Details';

const ListView = ({
  sortedSlides,
  currentPageList,
  slidesPerPageList,
  handleGridClick,
  pins,
  setPins,
  slides,
  setSlides,
  tags,
  setTags,
  setSelectedSlide,
}) => {
  const paginatedSlidesList = sortedSlides.slice(
    (currentPageList - 1) * slidesPerPageList,
    currentPageList * slidesPerPageList
  );
  const [hoveredDate, setHoveredDate] = useState({});

  return (
    <>
      <List style={{height:'78vh',overflow:'auto'}}>
        {paginatedSlidesList.map((slide, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <ListItem button onClick={() => handleGridClick(slide.id)} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <ListItemText primary={slide.title} style={{ fontWeight: 'bold', fontSize: '0.9rem' }} />
                <div
                  style={{ fontSize: '0.8rem', color: '#555', marginLeft: '16px' }}
                  onMouseEnter={() => setHoveredDate(prev => ({ ...prev, [slide.id]: 'created' }))}
                  onMouseLeave={() => setHoveredDate(prev => ({ ...prev, [slide.id]: null }))}
                >
                  <strong>Created: </strong>
                  {hoveredDate[slide.id] === 'created'
                    ? SelectUtility.formatDate(slide.dateCreated)
                    : SelectUtility.timeAgo(slide.dateCreated)}
                </div>

                <div
                  style={{ fontSize: '0.8rem', color: '#555', marginLeft: '16px' }}
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
            <Details
              slide={slide}
              pins={pins}
              setPins={setPins}
              slides={slides}
              setSlides={setSlides}
              tags={tags}
              setTags={setTags}
              setSelectedSlide={setSelectedSlide}
            />
          </div>
        ))}
      </List>
    </>
  );
};

export default ListView;
