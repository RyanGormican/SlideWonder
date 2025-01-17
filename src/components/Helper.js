export const saveSlideToLocalStorage = (updatedSlides, pins, tags) => {
  const existingData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};

  const updatedData = {
    slides: updatedSlides !== 1 ? updatedSlides : existingData.slides || [],
    settings: {},
    pins: pins !== 1 ? pins : existingData.pins,
    tags: tags !== 1 ? tags : existingData.tags,
  };

  localStorage.setItem('SlideWonderdata', JSON.stringify(updatedData));
};
