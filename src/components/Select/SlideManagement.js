import { saveSlideToLocalStorage } from '../Helper';
export const handleAddSlide = (slides,setSlides) => {
    const currentDate = new Date().toISOString();
    const currentTimestamp = Date.now();
    const newSlide = {
      title: `New Slide ${slides.length + 1}`,
      deck: [], 
      id: currentTimestamp,
      dateCreated: currentDate,
      lastUpdated: currentDate,
    };
    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);
    saveSlideToLocalStorage(updatedSlides,1,1);
  };

export  const handleDeleteSlide = (slideId,slides,setSlides) => {
    const updatedSlides = slides.filter(slide => slide.id !== slideId);
    setSlides(updatedSlides);
    saveSlideToLocalStorage(updatedSlides,1,1);
  };

 export const handleSaveTitle = (slide,slides,setSlides,setEditingTitle,newTitle) => {
    const updatedSlides = slides.map(slideItem =>
      slideItem.title === slide.title ? { ...slideItem, title: newTitle } : slideItem
    );
    setSlides(updatedSlides);
    setEditingTitle(null);
    saveSlideToLocalStorage(updatedSlides,1,1);
  };

export const handleDuplicateSlide = (slide, slides, setSlides) => {
  const currentDate = new Date().toISOString();
  const currentTimestamp = Date.now();


  const duplicatedSlide = {
    ...slide,
    id: currentTimestamp, 
    title: `Copy of ${slide.title}`, 
    dateCreated: currentDate,
    lastUpdated: currentDate,
  };


  const updatedSlides = [...slides, duplicatedSlide];

  setSlides(updatedSlides);
  saveSlideToLocalStorage(updatedSlides,1,1);
};
export const togglePin = (slideId, pins, setPins, slides, setSlides) => {

  const currentPins = pins || [];

  const isPinned = currentPins.includes(slideId);
  
  let updatedPins;
  
  if (isPinned) {
    updatedPins = currentPins.filter(id => id !== slideId);
  } else {
    updatedPins = [...currentPins, slideId];
  }
  
  setPins(updatedPins);  
  saveSlideToLocalStorage(slides, updatedPins,1);  
};
export const addTag = (slideId, newTag, tags, setTags, slides, setSlides) => {
  if (newTag.length === 0) {
    return;
  }
  
  const currentTags = tags || [];


  const tagIndex = currentTags.findIndex(tag => tag.id === slideId);

  if (tagIndex === -1) {
    currentTags.push({
      id: slideId,
      titles: [newTag],
    });
  } else {
    const titles = currentTags[tagIndex].titles;
    if (!titles.includes(newTag)) {
      titles.push(newTag);
    }
  }

  setTags(currentTags);
  saveSlideToLocalStorage(1, 1, currentTags);
};

export const deleteTag = (slideId, tagTitle, tags, setTags) => {
  const updatedTags = tags.map(tag => {
    if (tag.id === slideId) {
      const updatedTitles = tag.titles.filter(title => title !== tagTitle);
      return { ...tag, titles: updatedTitles };
    }
    return tag;
  }).filter(tag => tag.titles.length > 0);  

  setTags(updatedTags);
  saveSlideToLocalStorage(1, 1, updatedTags);  
};
