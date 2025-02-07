export const saveSlideToLocalStorage = (updatedSlides, pins, tags) => {
  const existingData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};

  const updatedData = {
    slides: updatedSlides !== 1 ? updatedSlides : existingData.slides || [],
    settings: existingData.settings || [],
    pins: pins !== 1 ? pins : existingData.pins,
    tags: tags !== 1 ? tags : existingData.tags,
    personaltemplates: existingData.personaltemplates,
  };

  localStorage.setItem('SlideWonderdata', JSON.stringify(updatedData));
};
export const saveSettingsToLocalStorage = (updatedSettings) => {
  const existingData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
  const updatedData = {
    slides: existingData.slides || [],  // 
    settings: updatedSettings !== 1 ? updatedSettings : existingData.settings || [],  
    pins: existingData.pins || [],      
    tags: existingData.tags || [],    
    personaltemplates: existingData.personaltemplates,
  };

  localStorage.setItem('SlideWonderdata', JSON.stringify(updatedData));
};


