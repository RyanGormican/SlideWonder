

export const saveSlideToLocalStorage = (updatedSlides) => {
  localStorage.setItem('SlideWonderdata', JSON.stringify({ slides: updatedSlides, settings: {} }));
};
