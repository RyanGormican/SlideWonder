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
    saveSlideToLocalStorage(updatedSlides);
  };

export  const handleDeleteSlide = (slideId,slides,setSlides) => {
    const updatedSlides = slides.filter(slide => slide.id !== slideId);
    setSlides(updatedSlides);
    saveSlideToLocalStorage(updatedSlides);
  };

 export const handleSaveTitle = (slide,slides,setSlides,setEditingTitle,newTitle) => {
    const updatedSlides = slides.map(slideItem =>
      slideItem.title === slide.title ? { ...slideItem, title: newTitle } : slideItem
    );
    setSlides(updatedSlides);
    setEditingTitle(null);
    saveSlideToLocalStorage(updatedSlides);
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
  saveSlideToLocalStorage(updatedSlides);
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
  saveSlideToLocalStorage(slides, updatedPins);  
};
