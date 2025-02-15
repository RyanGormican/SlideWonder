import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { renderCanvasContent } from '../Slide/Canvas/CanvasRender';
import { Icon } from '@iconify/react';
import Details from './Details';
const CanvasItem = ({ slide, slides, handleGridClick }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const slideData = slides.find(s => s.id === slide.id);
    const deckItem = slideData?.deck && slideData.deck[0];

    if (canvasElement) {
      const fabricCanvas = canvasElement.fabricCanvas;
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }

      const parentGridItem = canvasElement.closest(".locked");
      const parentWidth = parentGridItem?.offsetWidth || 0;

      if (deckItem) {
        const newFabricCanvas = new Canvas(canvasElement, {
          width: parentWidth,
          height: canvasElement.height,
          preserveObjectStacking: true,
          backgroundColor: deckItem.backgroundColor,
        });

        canvasElement.fabricCanvas = newFabricCanvas;
        renderCanvasContent(newFabricCanvas, deckItem.content, parentWidth, canvasElement.height, 1);
      } else {
        const context = canvasElement.getContext('2d');
        context.clearRect(0, 0, parentWidth, canvasElement.height);
        context.fillStyle = 'white';
        context.fillRect(0, 0, parentWidth, canvasElement.height);
      }
    }
  }, [slides, slide.id]);

  return (
    <div className="locked" key={slide.id} onClick={() => handleGridClick(slide.id)} style={{ cursor: 'pointer',   
      borderRadius: '8px',
      padding: '10px',
      flexShrink: 0,
      flexBasis: 'auto',
    }}>
      <canvas ref={canvasRef} />
      {slide.title}
    </div>
  );
};

const TimelineView = ({ view, slides, pins,setPins,setSlides, tags, setTags, setSelectedSlide, sortedSlides, handleGridClick }) => {
  const groupSlidesByDate = () => {
    const groupedSlides = {};

    sortedSlides.forEach((slide) => {
      const slideDate = new Date(slide.dateCreated).toISOString().split('T')[0];

      if (!groupedSlides[slideDate]) {
        groupedSlides[slideDate] = new Set();
      }
      groupedSlides[slideDate].add(slide.id);

      if (slide.deck) {
        slide.deck.forEach((deckItem) => {
          if (deckItem.id) {
            const deckItemDate = new Date(deckItem.id).toISOString().split('T')[0];
            if (!groupedSlides[deckItemDate]) {
              groupedSlides[deckItemDate] = new Set();
            }
            groupedSlides[deckItemDate].add(slide.id);
          }
        });
      }
    });

    const sortedDates = Object.keys(groupedSlides).sort((a, b) => new Date(b) - new Date(a));

    const sortedGroupedSlides = {};
    sortedDates.forEach((date) => {
      sortedGroupedSlides[date] = sortedSlides.filter((slide) => groupedSlides[date].has(slide.id));
    });

    return sortedGroupedSlides;
  };

  const groupedSlides = groupSlidesByDate();

  const getColor = (isoDateString) => {
    const date = new Date(isoDateString);
    const dayOfWeek = date.getDay(); 

    switch(dayOfWeek) {
      case 0: return '#FF464C';       
      case 1: return '#FFA500';  
      case 2: return '#FFD700';   
      case 3: return '#90EE90';         
      case 4: return '#3CB371';     
      case 5: return '#00BFFF';      
      case 6: return '#D8B3FF';  
      default: return '#FFFFFF';    
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100vw', maxHeight: '75vh', overflowY: 'auto' }}>
        {Object.keys(groupedSlides).map((date, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
              {date}
            </div>
            <div style={{ backgroundColor: getColor(date), display: 'flex', flexDirection: 'row', maxWidth: '100vw', overflowX: 'auto', gap: '10px' }}>
              {groupedSlides[date].map((slide) => (
               <div style={{flexDirection: 'column'}}>
              <CanvasItem 
                  key={slide.id} 
                  slide={slide} 
                  slides={slides} 
                  handleGridClick={handleGridClick} 
                />
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

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
