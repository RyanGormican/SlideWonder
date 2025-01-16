

export const saveSlideToLocalStorage = (updatedSlides, pins) => {
  const existingData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
  localStorage.setItem('SlideWonderdata', JSON.stringify({ slides: updatedSlides, settings: {},     pins: pins !== null && pins !== undefined ? pins : existingData.pins }));
};
