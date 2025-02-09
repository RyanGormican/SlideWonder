import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Feedback from './components/Feedback/Feedback';
import Navigate from './components/Navigate';
import Select from './components/Select/Select';
import Present from './components/Present/Present';
import SlideManager from './components/Slide/SlideManager';
import Sync from './components/Sync/Sync';
import Settings from './components/Settings/Settings';
import Modulars from './components/Modulars/Modulars';
import WordCloud from './components/WordCloud/WordCloud';
import Stats from './components/Stats/Stats';
import { saveSettingsToLocalStorage, saveModularsToLocalStorage } from './components/Helper';
import { Icon } from '@iconify/react';
import { Button, Tooltip } from '@mui/material';

function App({ theme, setTheme }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('select');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [pins, setPins] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);
  const [modulars, setModulars] = useState([]);
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
      modulars: [],
    };
    setSlides(savedData.slides);
    setPins(savedData.pins);
    setTags(savedData.tags);
    setTheme(savedData.settings.theme);
    setPersonalTemplates(savedData.personaltemplates);
    setModulars(savedData.modulars || []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (theme && loaded) {
      const savedData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
      const updatedSettings = { ...savedData.settings, theme };
      saveSettingsToLocalStorage(updatedSettings);
    }
  }, [theme]);

  useEffect(() => {
    saveModularsToLocalStorage(modulars);
  }, [modulars]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`App ${view !== 'present' ? 'not-present' : 'present'}`}>
        <div className="portrait">
          <Tooltip title="User Profile">
            <Icon
              icon="bi:person-fill"
              width="3.13vw"
              height="4vh"
              onClick={() => setView(view === 'sync' ? 'select' : 'sync')}
            />
          </Tooltip>
          <Tooltip title="Word Cloud">
            <Icon
              icon="carbon:word-cloud"
              width="3.13vw"
              height="4vh"
              onClick={() => setView(view === 'cloud' ? 'select' : 'cloud')}
            />
          </Tooltip>
          <Tooltip title="Statistics">
            <Icon
              icon="gridicons:stats"
              width="3.13vw"
              height="4vh"
              onClick={() => setView(view === 'stats' ? 'select' : 'stats')}
            />
          </Tooltip>
          <Tooltip title="Modulars">
            <Icon
              icon="material-symbols:interactive-space"
              width="3.13vw"
              height="4vh"
              onClick={() => setView(view === 'modulars' ? 'select' : 'modulars')}
            />
          </Tooltip>
          <Tooltip title="Settings">
            <Icon
              icon="mdi:gear"
              width="3.13vw"
              height="4vh"
              onClick={() => setView(view === 'settings' ? 'select' : 'settings')}
            />
          </Tooltip>
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
            setModulars={setModulars}
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
            modulars={modulars}
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

        <div style={{ display: view === 'settings' ? 'block' : 'none' }}>
          <Settings
            slides={slides}
            setSlides={setSlides}
            setPins={setPins}
            setTags={setTags}
            theme={theme}
            setSettings={setTheme}
            setPersonalTemplates={setPersonalTemplates}
            setModulars={setModulars}
          />
        </div>

        <div style={{ display: view === 'modulars' ? 'block' : 'none' }}>
          <Modulars
            modulars={modulars}
            setModulars={setModulars}
            view={view}
          />
        </div>

        {isModalOpen && <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
      </div>
    </DndProvider>
  );
}

export default App;
