import { saveAs } from 'file-saver'; 
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

   // Function to convert slide data to CSV
export const convertToCSV = (slide) => {
  // Check if slide is a valid object
  if (!slide || typeof slide !== 'object') {
    console.error('Invalid slide data');
    return ''; // Return an empty string if the slide is invalid
  }

  // Create header row based on the slide's properties
  const header = Object.keys(slide).join(',');

  // Create row from slide values
  const row = Object.values(slide).map(value => {
    // If the value is an object or array, convert it to a string 
    return typeof value === 'object' ? JSON.stringify(value) : value;
  }).join(',');

  return `${header}\n${row}`;
};



  // Function to download CSV
 export const handleDownloadCSV = (slide) => {
    const csvData = convertToCSV(slide);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${slide.title}.csv`);
  };
export  const handleDownloadAll = (slides) => {
  const allSlidesCSV = slides.map(slide => convertToCSV(slide)).join('\n');
  const blob = new Blob([allSlidesCSV], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'slides.csv');
};


export  const handleTitleClick = (slide,setEditingTitle,setNewTitle) => {
    setEditingTitle(slide.title);
    setNewTitle(slide.title);
  };

  

export  const handleInfoClick = (slide,setSelectedSlide) => {
    setSelectedSlide(slide);
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