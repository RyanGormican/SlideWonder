

export const saveSlideToLocalStorage = (updatedSlides, pins) => {
  localStorage.setItem('SlideWonderdata', JSON.stringify({ slides: updatedSlides, settings: {}, pins: pins }));
};
