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

 export const handleSaveTitle = (slide,slides,setSlides,newTitle,setEditingTitle) => {
    const updatedSlides = slides.map(slideItem =>
      slideItem.title === slide.title ? { ...slideItem, title: newTitle } : slideItem
    );
    setSlides(updatedSlides);
    setEditingTitle(null);
    saveSlideToLocalStorage(updatedSlides);
  };
  