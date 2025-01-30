import { saveAs } from 'file-saver'; 
import { saveSlideToLocalStorage } from '../Helper';
export const timeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date); // Difference in milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};

export  const formatDate = (date) => {
    return new Date(date).toLocaleString(); 
  };
  // Function to convert slide data to JSON
export const convertToJSON = (slide) => {
  // Check if slide is a valid object
  if (!slide || typeof slide !== 'object') {
    console.error('Invalid slide data');
    return ''; // Return an empty string if the slide is invalid
  }

  // Convert the slide object to a JSON string
  return JSON.stringify(slide, null, 2); // Pretty print with 2 spaces indentation
};
// Function to download slide as a JSON file
export const handleDownloadJSON = (slide) => {
  const jsonData = convertToJSON(slide);
  const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
  saveAs(blob, `${slide.title}.json`);
};


export const handleDownloadAll = () => {
  const slideWonderData = JSON.parse(localStorage.getItem('SlideWonderdata'));

  if (slideWonderData) {
    const blob = new Blob([JSON.stringify(slideWonderData, null, 2)], { type: 'application/json;charset=utf-8;' });
    saveAs(blob, 'SlideWonderdata.json');
  } else {
  }
};



export  const handleTitleClick = (slide,setEditingTitle,setNewTitle) => {
    setEditingTitle(slide.title);
    setNewTitle(slide.title);
  };

  

export  const handleInfoClick = (slide,setSelectedSlide) => {
    setSelectedSlide(slide);
  };

export const handleImportJSON = (file, setSlides, setPins, setTags) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      const slidesFromLocalStorage = JSON.parse(localStorage.getItem('SlideWonderdata') || '{}');
      
      setSlides(importedData.slides || slidesFromLocalStorage.slides || []);
      setTags(importedData.tags || slidesFromLocalStorage.tags || []);
      setPins(importedData.pins || slidesFromLocalStorage.pins || []);
      saveSlideToLocalStorage(importedData.slides || slidesFromLocalStorage.slides || [], importedData.pins || slidesFromLocalStorage.pins || [],  importedData.tags || slidesFromLocalStorage.tags || [])
    } catch (error) {
      console.error("Error importing JSON", error);
    }
  };
  reader.readAsText(file);
 
};

export  const handleSearchChange = (e,setSearchQuery) => {
    setSearchQuery(e.target.value);
  };


export  const toggleSortOrder = (setSortOrder) => {
    setSortOrder((prev) => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

export  const changeSortField = (field,setSortOrder) => {
    setSortOrder((prev) => ({
      ...prev,
      field,
      direction: 'asc', // Reset direction to ascending when changing the field
    }));
  };