import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import Feedback from './components/Feedback/Feedback';
import Navigate from './components/Navigate';
import Select from './components/Select/Select';
import Present from './components/Present/Present';
import SlideManager from './components/Slide/SlideManager';
import Sync from './components/Sync/Sync';
import {saveSettingsToLocalStorage} from './components/Helper';
import { Icon } from '@iconify/react';
function App({theme,setTheme}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('select');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [pins,setPins] = useState([]);
  const [tags,setTags]= useState([]);
  const [user,setUser]=useState(null);
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {
      slides: [
        {
          title: 'New Slide',
          deck: [],
          id: Date.now(),
         dateCreated:  Date.now(),
      lastUpdated:  Date.now(),
        },
      ],
      pins:[],
      tags:[],
    };
    setSlides(savedData.slides);
    setPins(savedData.pins);
    setTags(savedData.tags);
    setTheme(savedData.settings.theme);
  }, []);
  
  useEffect(() => {
}, [view]);

useEffect(() => {
    if (theme) {
      const savedData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
      const updatedSettings = { ...savedData.settings, theme };
      saveSettingsToLocalStorage(updatedSettings);
    }
  }, [theme]);
  return (
    <DndProvider backend={HTML5Backend}>
<div className={`App ${view !== 'present' ? 'not-present' : 'present'}`}>
 
<div className="portrait">
<Icon icon="bi:person-fill"   width= "3.13vw" height= "4vh"  onClick={() => setView(view === 'sync' ? 'select' : 'sync')}  />
</div>


        {view !== 'present' && (
    <>
        <Navigate toggleFeedbackModal={() => setIsModalOpen(!isModalOpen)} />
        <div className="title">SlideWonder</div>
   </>
  )}
  
<div style={{ display: view === 'sync' ? 'block' : 'none' }}>
  <Sync
    slides={slides}
    setSlides={setSlides}
    pins={pins}
    setPins={setPins}
    tags={tags}
    setTags={setTags}
    user={user}
    setUser={setUser}
    theme={theme}
    setTheme={setTheme}
  />
</div>
 {view === 'select' ? (
  <Select
    slides={slides}
    setSlides={setSlides}
    pins={pins}
    setPins={setPins}
    tags={tags}
    setTags={setTags}
    handleGridClick={(id) => {
      const selectedSlide = slides.find((slide) => slide.id === id);
      setCurrentSlide(selectedSlide);
      setView('slide');
    }}
    theme={theme}
    setTheme={setTheme}
  />
) : view === 'slide' ? (
  <div       style={{textAlign: 'center'}}>
    <Icon
      icon="mingcute:back-line"
      width="3vw"
      height="3vh"
      onClick={() => setView('select')}
    />
         {currentSlide && currentSlide.deck.length > 0 && (
    <Icon
      icon="gg:play-button"
      width="3vw"
      height="3vh"
      onClick={() => setView('present')}
    />
    )}
    <SlideManager
      slides={slides}
      setSlides={setSlides}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
    />
  </div>
) : view === 'present' && (
  <div>
<Present
  currentSlide={slides.find((slide) => slide.id === currentSlide?.id) || null} 
  setView={setView}
/>

  </div>
)}
        {isModalOpen && <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
      </div>
    </DndProvider>
  );
}

export default App;
