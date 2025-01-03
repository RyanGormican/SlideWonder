import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import Feedback from './components/Feedback/Feedback';
import Navigate from './components/Navigate';
import Select from './components/Select/Select';
import SlideManager from './components/Slide/SlideManager';
import { Icon } from '@iconify/react';
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('select');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {
      slides: [
        {
          title: 'New Slide',
          deck: [],
          id: Date.now(),
        },
      ],
    };
    setSlides(savedData.slides);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Navigate toggleFeedbackModal={() => setIsModalOpen(!isModalOpen)} />
        <div className="title">SlideWonder</div>
              <Icon
                icon="mingcute:back-line"
                width="24"
                height="24"
                onClick={() => setView('select')}
              />
        {view === 'select' ? (
          <Select
            slides={slides}
            setSlides={setSlides}
            handleGridClick={(id) => {
              const selectedSlide = slides.find((slide) => slide.id === id);
              setCurrentSlide(selectedSlide);
              setView('slide');
            }}
          />
        ) : (
          <SlideManager
            slides={slides}
            setSlides={setSlides}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        )}
        {isModalOpen && <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
      </div>
    </DndProvider>
  );
}

export default App;
