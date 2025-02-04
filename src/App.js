import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Feedback from './components/Feedback/Feedback';
import Navigate from './components/Navigate';
import Select from './components/Select/Select';
import Present from './components/Present/Present';
import SlideManager from './components/Slide/SlideManager';
import Sync from './components/Sync/Sync';
import WordCloud from './components/WordCloud/WordCloud';
import Stats from './components/Stats/Stats';
import { saveSettingsToLocalStorage } from './components/Helper';
import { Icon } from '@iconify/react';

function App({ theme, setTheme }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('select');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [pins, setPins] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);
  const [loaded,setLoaded] =useState(false);
  const [personalTemplates, setPersonalTemplates] =useState([]);
  const [fileLastModified, setFileLastModified] = useState('');
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {
      slides: [
        {
          title: 'New Slide',
          deck: [],
          id: Date.now(),
          dateCreated: Date.now(),
          lastUpdated: Date.now(),
        },
      ],
      pins: [],
      tags: [],
      settings: [
        {
          theme: 'light',
        },
      ],
      personalTemplates:[],
      downloadedtemplates:[],
    };
    setSlides(savedData.slides);
    setPins(savedData.pins);
    setTags(savedData.tags);
    setTheme(savedData.settings.theme);
    setPersonalTemplates(savedData.personaltemplates);
    setLoaded(true);
  }, []);

  useEffect(() => {
    // No-op useEffect for view updates
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
          <Icon
            icon="bi:person-fill"
            width="3.13vw"
            height="4vh"
            onClick={() => setView(view === 'sync' ? 'select' : 'sync')}
          />
          <Icon icon="carbon:word-cloud"   width="3.13vw"
            height="4vh"    onClick={() => setView(view === 'cloud' ? 'select' : 'cloud')}/>
            <Icon icon="gridicons:stats"  width="3.13vw"
            height="4vh"    onClick={() => setView(view === 'stats' ? 'select' : 'stats')} />
        </div>

        {view !== 'present' && (
          <>
            <Navigate toggleFeedbackModal={() => setIsModalOpen(!isModalOpen)} />
            <h1 className="title">SlideWonder</h1>
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
            personalTemplates={personalTemplates}
            setPersonalTemplates={setPersonalTemplates}
            fileLastModified={fileLastModified}
            setFileLastModified={setFileLastModified}
          />
        </div>

        <div style={{ display: view === 'select' ? 'block' : 'none' }}>
          <Select
            loaded={loaded}
            slides={slides}
            setSlides={setSlides}
            pins={pins}
            setPins={setPins}
            tags={tags}
            setTags={setTags}
            personalTemplates={personalTemplates}
            setPersonalTemplates={setPersonalTemplates}
            handleGridClick={(id) => {
              const selectedSlide = slides.find((slide) => slide.id === id);
              setCurrentSlide(selectedSlide);
              setView('slide');
            }}
            theme={theme}
            setTheme={setTheme}
            view={view}
            fileLastModified={fileLastModified}
          />
        </div>

     <div style={{ display: view === 'slide' ? 'block' : 'none' }}>
  <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Icon
      icon="mingcute:back-line"
      width="3vw"
      height="3vh"
      onClick={() => setView('select')}
    />
    {currentSlide && (
      <h1 style={{ margin: '0 10px' }}> {currentSlide.title} </h1>
    )}
    {currentSlide && currentSlide.deck.length > 0 && (
      <Icon
        icon="gg:play-button"
        width="3vw"
        height="3vh"
        onClick={() => setView('present')}
      />
    )}
  </div>
  <SlideManager
    slides={slides}
    setSlides={setSlides}
    currentSlide={currentSlide}
    setCurrentSlide={setCurrentSlide}
    personalTemplates={personalTemplates}
    setPersonalTemplates={setPersonalTemplates}
  />
</div>



        <div style={{ display: view === 'present' ? 'block' : 'none' }}>
          <Present
            currentSlide={slides.find((slide) => slide.id === currentSlide?.id) || null}
            view={view}
            setView={setView}
          />
        </div>
         <div style={{ display: view === 'cloud' ? 'block' : 'none' }}>
          <WordCloud
            slides={slides}
            tags={tags}
          />
        </div>
         <div style={{ display: view === 'stats' ? 'block' : 'none' }}>
          <Stats
            slides={slides}
          />
        </div>
        {isModalOpen && <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
      </div>
    </DndProvider>
  );
}

export default App;
