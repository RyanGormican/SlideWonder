import React, { useState,useEffect } from 'react';
import { Typography, IconButton } from '@mui/material';
import InfoModal from '../InfoModal/InfoModal';
import * as SlideManagement from './SlideManagement';
import GridView from './GridView'; 
import ListView from './ListView';
import Buttons from './Buttons';
import PaginationControls from './PaginationControls';
import { saveSlideToLocalStorage} from '../Helper'
const Select = ({ loaded, slides, setSlides, pins,setPins,tags,setTags, personalTemplates, setPersonalTemplates, handleGridClick,theme, setTheme,view, fileLastModified}) => {
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
  const[slideCopy, setSlideCopy] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(9);
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
    setCurrentPageGrid(1);
    setCurrentPageList(1)
    }, [searchQuery]);
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
  }if (field === 'deckSize') {
    return direction === 'asc'
      ? a.deck.length - b.deck.length
      : b.deck.length - a.deck.length;
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

  

  const handlePageChangeGrid = (newPage) => {
    setCurrentPageGrid(newPage);
  };

  const handlePageChangeList = (newPage) => {
    setCurrentPageList(newPage);
  };
   const onAddSlide = () => {
    SlideManagement.handleAddSlide(slides, setSlides);
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
    {/* Buttons */}
    <Buttons onAddSlide={onAddSlide} theme={theme} setTheme={setTheme} sortOrder={sortOrder} setSortOrder={setSortOrder} searchQuery={searchQuery} setSearchQuery={setSearchQuery} slides={slides} tags={tags} toggleTag={toggleTag} tagStates={tagStates} toggleAllTags={toggleAllTags} uniqueTags={uniqueTags} setViewType={setViewType} setSlides={setSlides} setPins={setPins} setTags={setTags} setSlidesPerView={setSlidesPerView}/>

    {/* Conditional rendering of grid or list view */}
    {viewType === 'grid' ? (
      <div>
        <GridView viewType={viewType} sortedSlides={sortedSlides} currentPageGrid={currentPageGrid} slidesPerPageGrid={slidesPerView} handleGridClick={handleGridClick} editingTitle={editingTitle} setEditingTitle={setEditingTitle} newTitle={newTitle} setNewTitle={setNewTitle} slides={slides} setSlides={setSlides} setSelectedSlide={setSelectedSlide} pins={pins} setPins={setPins} tags={tags} setTags={setTags} view={view} />
        <PaginationControls currentPage={currentPageGrid} slidesPerPage={slidesPerView} sortedSlides={sortedSlides} handlePageChange={handlePageChangeGrid} onAddSlide={onAddSlide} slides={slides} setSlides={setSlides}/>
      </div>
    ) : (
      <div>
        <ListView sortedSlides={sortedSlides} currentPageList={currentPageList} slidesPerPageList={slidesPerView} handleGridClick={handleGridClick} setHoveredDate={setHoveredDate} hoveredDate={hoveredDate} />
        <PaginationControls currentPage={currentPageList} slidesPerPage={slidesPerView} sortedSlides={sortedSlides} handlePageChange={handlePageChangeList} onAddSlide={onAddSlide} slides={slides} setSlides={setSlides}/>
      </div>
    )}

    <InfoModal open={Boolean(selectedSlide)} slide={selectedSlide} fileLastModified={fileLastModified} onClose={() => setSelectedSlide(null)} />
  </div>
);

};

export default Select;
