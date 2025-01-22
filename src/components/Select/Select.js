import React, { useState,useEffect } from 'react';
import { Typography, IconButton } from '@mui/material';
import InfoModal from '../InfoModal/InfoModal';
import * as SlideManagement from './SlideManagement';
import GridView from './GridView'; 
import ListView from './ListView';
import Buttons from './Buttons';
const Select = ({ slides, setSlides, pins,setPins,tags,setTags, handleGridClick,theme, setTheme}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [sortOrder, setSortOrder] = useState({ field: 'lastUpdated', direction: 'desc' });
  const [viewType, setViewType] = useState('grid');
  const [hoveredDate, setHoveredDate] = useState({});
  const [currentPageGrid, setCurrentPageGrid] = useState(1);
  const [currentPageList, setCurrentPageList] = useState(1);
  const [sortedSlides, setSortedSlides] = useState([]);
  // Filter slides based on search query
const filteredSlides = slides.filter(slide => 
  slide.title.toLowerCase().includes(searchQuery.toLowerCase())
);
  const [tagStates, setTagStates] = useState({});


 
  useEffect(() => {
    const newTagStates = tags?.reduce((acc, tag) => {
      tag.titles.forEach(title => {
        if (!acc[title]) {
          acc[title] = true; 
        }
      });
      return acc;
    }, {});
    setTagStates(newTagStates); 
  }, [tags]); 


const toggleTag = (title) => {
  setTagStates((prevStates) => ({
    ...prevStates,
    [title]: !prevStates[title], 
  }));
};

const toggleAllTags = (isOn) => {
  setTagStates((prevStates) =>
    Object.keys(prevStates).reduce((acc, title) => {
      acc[title] = isOn;
      return acc;
    }, {})
  );
};


const filteredTagIds = tags
  ?.filter(tag => 
    tag.titles.some(title => title.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  .map(tag => tag.id);
  
const mergedFilteredSlides = [
  ...filteredSlides,
  ...slides.filter(slide => filteredTagIds?.includes(slide.id))
];

const allTagsOn = Object.values(tagStates || {}).every((state) => state === true);


const uniqueFilteredSlides = allTagsOn
  ? Array.from(new Set(mergedFilteredSlides.map(slide => slide.id)))
      .map(id => mergedFilteredSlides.find(slide => slide.id === id))
  : [];


const filteredSlidesByTags = mergedFilteredSlides.filter(slide => {
  return tags?.some(tag => 
    tag.titles.some(title => tagStates[title] === true) && 
    tag.id === slide.id // Ensure the slide's id matches the tag's id
  );
});

const filteredSlidesConditional = allTagsOn ? uniqueFilteredSlides : filteredSlidesByTags;

const uniqueSlides = Array.from(new Set(filteredSlidesConditional.map(slide => slide.id)))
  .map(id => filteredSlidesConditional.find(slide => slide.id === id));


  useEffect(() => {
 // Sort slides based on selected field and direction
const slideList = [...uniqueSlides].sort((a, b) => {
  const { field, direction } = sortOrder;
  // First, prioritize pinned slides
  const aIsPinned = pins?.includes(a.id);
  const bIsPinned = pins?.includes(b.id);
  
  if (aIsPinned && !bIsPinned) return -1; // a is pinned, b is not
  if (!aIsPinned && bIsPinned) return 1;  // b is pinned, a is not
  
  // If both are pinned or neither is pinned, continue sorting by the selected field
  if (field === 'name') {
    return direction === 'asc'
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  }
  if (field === 'lastUpdated') {
    return direction === 'asc'
      ? new Date(a.lastUpdated) - new Date(b.lastUpdated)
      : new Date(b.lastUpdated) - new Date(a.lastUpdated);
  }
  if (field === 'dateCreated') {
    return direction === 'asc'
      ? new Date(a.dateCreated) - new Date(b.dateCreated)
      : new Date(b.dateCreated) - new Date(a.dateCreated);
  }

  return 0; // Default sorting if no matching criteria
});
  setSortedSlides((prevSortedSlides) => {

    if (JSON.stringify(prevSortedSlides) !== JSON.stringify(slideList)) {
      return slideList;
    }
    return prevSortedSlides; 
  });
  }, [uniqueSlides, sortOrder, pins]);

  // Pagination logic for grid view 
  const slidesPerPageGrid = 9;
  const startIndexGrid = (currentPageGrid - 1) * slidesPerPageGrid;
  const paginatedSlidesGrid = sortedSlides.slice(startIndexGrid, startIndexGrid + slidesPerPageGrid);

  // Pagination logic for list view
  const slidesPerPageList = 15;
  const startIndexList = (currentPageList - 1) * slidesPerPageList;
  const paginatedSlidesList = sortedSlides.slice(startIndexList, startIndexList + slidesPerPageList);

  const handlePageChangeGrid = (newPage) => {
    setCurrentPageGrid(newPage);
  };

  const handlePageChangeList = (newPage) => {
    setCurrentPageList(newPage);
  };
const uniqueTags = [];
const seenTitles = new Set();

tags?.forEach(tag => {
  tag.titles.forEach(title => {
    if (!seenTitles.has(title)) {
      seenTitles.add(title);
      uniqueTags.push({ title, id: tag.id });
    }
  });
});

  return (
    <div>
      {/* Buttons  */}
      <Buttons 
      
      theme={theme}
      setTheme={setTheme}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      slides={slides}
      tags={tags}
      toggleTag={toggleTag}
      tagStates={tagStates}
      toggleAllTags={toggleAllTags}
      uniqueTags={uniqueTags}
      setViewType={setViewType}
      setSlides={setSlides}
      setPins={setPins}
      setTags={setTags}
      />

      {/* Conditional rendering of grid or list view */}
      {viewType === 'grid' ? (
        <div>
       <GridView
  sortedSlides={sortedSlides}
  currentPageGrid={currentPageGrid}
  slidesPerPageGrid={slidesPerPageGrid}
  handleGridClick={handleGridClick}
  editingTitle={editingTitle}
  setEditingTitle={setEditingTitle}
  newTitle={newTitle}
  setNewTitle={setNewTitle}
  slides={slides}
  setSlides={setSlides}
  setSelectedSlide={setSelectedSlide}
  pins={pins}
  setPins={setPins}
  tags={tags}
  setTags={setTags}
/>


          {/* Pagination controls with Add Slide button */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChangeGrid(currentPageGrid - 1)}
                disabled={currentPageGrid === 1}
                style={{ marginRight: '16px' }}
              >
                Previous
              </button>

              {/* Add Slide Button */}
              <IconButton onClick={() => SlideManagement.handleAddSlide(slides, setSlides)} style={{ margin: '0 16px' }}>
                New Slide
              </IconButton>
              <button
                onClick={() => handlePageChangeGrid(currentPageGrid + 1)}
                disabled={currentPageGrid * slidesPerPageGrid >= sortedSlides.length}
                style={{ marginLeft: '16px' }}
              >
                Next
              </button>
            </div>

            {/* Page indicator */}
            {Math.ceil(sortedSlides.length / slidesPerPageGrid) >= 1 && (
              <Typography variant="body1" style={{ marginTop: '8px' }}>
                Page {currentPageGrid} of {Math.ceil(sortedSlides.length / slidesPerPageGrid)}
              </Typography>
            )}
          </div>
        </div>
      ) : (
        <div>
         <ListView
  sortedSlides={sortedSlides}
  currentPageList={currentPageList}
  slidesPerPageList={slidesPerPageList}
  handleGridClick={handleGridClick}
  setHoveredDate={setHoveredDate}
  hoveredDate={hoveredDate}
/>

          {/* Pagination controls with Add Slide button */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChangeList(currentPageList - 1)}
                disabled={currentPageList === 1}
                style={{ marginRight: '16px' }}
              >
                Previous
              </button>

              {/* Add Slide Button */}
              <IconButton onClick={() => SlideManagement.handleAddSlide(slides, setSlides)} style={{ height: '4vh' }}>
                New Slide
              </IconButton>

              <button
                onClick={() => handlePageChangeList(currentPageList + 1)}
                disabled={currentPageList * slidesPerPageList >= sortedSlides.length}
                style={{ marginLeft: '16px' }}
              >
                Next
              </button>
            </div>

            {/* Page indicator */}
            {Math.ceil(sortedSlides.length / slidesPerPageList) >= 1 && (
              <Typography variant="body1">
                Page {currentPageList} of {Math.ceil(sortedSlides.length / slidesPerPageList)}
              </Typography>
            )}
          </div>
        </div>
      )}
        
      <InfoModal open={Boolean(selectedSlide)} slide={selectedSlide} onClose={() => setSelectedSlide(null)} />
    </div>
  );
};

export default Select;
