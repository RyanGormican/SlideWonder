import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { renderCanvasContent } from '../Slide/Canvas/CanvasRender'; 
import { Icon } from '@iconify/react';
import { saveSlideToLocalStorage} from '../Helper';
import { Chip } from  '@mui/material';
const TagView = ({ view, slides, sortedSlides, tags, setTags, uniqueTags }) => {
  const [activeSlideId, setActiveSlideId] = useState(null);
  const canvasRefs = useRef({});

  useEffect(() => {
    sortedSlides.forEach((slide) => {
      const canvasElement = canvasRefs.current[slide.id];
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
          context.clearRect(0, 0, parentWidth,  canvasElement.height); // Clear the canvas
        }
      }
    });

    return () => {
      sortedSlides.forEach((slide) => {
        const canvasElement = canvasRefs.current[slide.id];
        if (canvasElement) {
          const fabricCanvas = canvasElement.fabricCanvas;
          if (fabricCanvas) {
            fabricCanvas.dispose();
          }
        }
      });
    };
  }, [sortedSlides, slides, view]);

  // Handle canvas click to set or toggle the active slide
  const handleCanvasClick = (slideId) => {
    setActiveSlideId(prevId => (prevId === slideId ? null : slideId));
  };
 const handleTagClick = (tagTitle) => {
  setTags(prevTags => {
    // Find the tag with the active slide ID
    const existingTag = prevTags.find(tag => tag.id === activeSlideId);

    let updatedTags;
    
    if (!existingTag) {
      // If the ID is not found, add a new entry with the tagTitle
      updatedTags = [...prevTags, { id: activeSlideId, titles: [tagTitle] }];
    } else {
      // If the title is already in the tag, remove it; otherwise, add it
      const updatedTitles = existingTag.titles.includes(tagTitle)
        ? existingTag.titles.filter(title => title !== tagTitle) // Remove title
        : [...existingTag.titles, tagTitle]; // Add title

      if (updatedTitles.length === 0) {
        // If no titles remain, remove the tag entirely
        updatedTags = prevTags.filter(tag => tag.id !== activeSlideId);
      } else {
        // Otherwise, update the tag with the new titles array
        updatedTags = prevTags.map(tag =>
          tag.id === activeSlideId ? { ...tag, titles: updatedTitles } : tag
        );
      }
    }

    // Save the updated tags 
    saveSlideToLocalStorage(1, 1, updatedTags);
    
    return updatedTags;
  });
};



  // Find the tag that corresponds to the active slide ID
  const activeSlideTag = tags.find(tag => tag.id === activeSlideId);
  return (
    <div style={{
}}>
      <div style={{ display: 'flex', marginTop: '30vh',flexDirection: 'row', maxWidth: '100vw', overflowX: 'auto' }}>
        {sortedSlides.map((slide, index) => (
          <div key={index} style={{ marginRight: '10px' }}>
            <div
              className="locked"
              onClick={() => handleCanvasClick(slide.id)}
              style={{
                backgroundColor: slide.id === activeSlideId ? 'grey' : 'transparent', 
                cursor: 'pointer'
              }}
            >
              <canvas ref={(el) => (canvasRefs.current[slide.id] = el)} />
              {slide.title}
            </div>
          </div>
        ))}
      </div>

      <div style={{display: activeSlideId ? 'block' : 'none',  flexWrap: 'wrap', marginTop: '20px' }}>
      <div style={{display:'flex'}}>
        {uniqueTags.map((tag, index) => {
          // Check if the activeSlideId is found in the tag
   const isTagFound = activeSlideTag && activeSlideTag.titles.includes(tag.title);

          return (
           <div key={index} onClick={() => handleTagClick(tag.title)}>
  <Chip
    label={tag.title}
    icon={
      <Icon
        icon={isTagFound ? "proicons:checkmark" : "iconoir:xmark"}
        color={isTagFound ? "green" : "red"}
      />
    }
    variant="outlined"
    clickable
    sx={{
      marginRight: "8px",
      padding: "5px",
      borderRadius: "16px",
      borderColor: isTagFound ? "green" : "red",
      color: isTagFound ? "green" : "red",
      "&:hover": {
        backgroundColor: isTagFound ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)",
      },
    }}
  />
</div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default TagView;
