import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { renderCanvasContent } from '../Slide/Canvas/CanvasRender'; 
import { Icon } from '@iconify/react';
import { saveSlideToLocalStorage} from '../Helper';
import { Chip,IconButton,TextField } from  '@mui/material';
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
                  context.fillStyle = 'white';
  context.fillRect(0, 0, parentWidth, canvasElement.height); 
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


useEffect(() => {
  setTags(prevTags => {
    const tagWithIdZero = prevTags.find(tag => tag.id === 0);
    
    let updatedTags;
    if (tagWithIdZero) {
      updatedTags = prevTags.map(tag =>
        tag.id === 0 ? { ...tag, titles: uniqueTags.map(tag => tag.title) } : tag
      );
    } else {
      updatedTags = [{ id: 0, titles: uniqueTags.map(tag => tag.title) }, ...prevTags];
    }

    if (JSON.stringify(updatedTags) !== JSON.stringify(prevTags)) {
      saveSlideToLocalStorage(1, 1, updatedTags);  
      return updatedTags;
    }

    return prevTags;  
  });
}, [uniqueTags]);


const [newTag, setNewTag] = useState("");
const handleAddTag = () => {
  if (newTag.trim()) {
    setTags(prevTags => {
      const updatedTags = prevTags.map(tag => {
        if (tag.id === 0) {
          return { ...tag, titles: [...tag.titles, newTag] };
        }
        return tag;
      });

      saveSlideToLocalStorage(1, 1, updatedTags);

      return updatedTags;
    });
    setNewTag("");
  }
};

const handleRemoveTag = (tagTitle) => {
  setTags(prevTags => {
    const updatedTags = prevTags.map(tag => {
      return {
        ...tag, 
        titles: tag.titles.filter(title => title !== tagTitle)  
      };
    });

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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-start', marginTop: '1rem' }}>
  {tags
    .find(tag => tag.id === 0)?.titles
    .map((title, index) => (
      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Chip
          label={title}
          style={{
            borderRadius: '16px',
            padding: '0.5rem 1rem',
          }}
        />
        <Icon
          icon="mdi:trash"
          onClick={() => handleRemoveTag(title)}
          style={{
            cursor: 'pointer',
            color: 'red',
            transition: 'color 0.3s',
          }}
        />
      </div>
    ))}
  <div style={{ display: 'flex', alignItems: 'center',  }}>
   <TextField
  type="text"
  value={newTag}
  onChange={(e) => setNewTag(e.target.value)}
  placeholder="Enter new tag"
  variant="outlined"
  sx={{
    padding: '0.5rem',
    width: '12rem',
    borderRadius: '8px',
    '& .MuiOutlinedInput-root': {
      borderColor: '#ddd',
      transition: 'border-color 0.3s',
    },
    '& .MuiOutlinedInput-root.Mui-focused': {
      borderColor: '#4caf50',
    },
    '& .MuiInputBase-input': {
      padding: '0.5rem',
    },
  }}
/>

    <IconButton
      onClick={handleAddTag}
      style={{
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
    >
      ADD TAG
    </IconButton>
  </div>
</div>

    </div>
  );
};

export default TagView;
