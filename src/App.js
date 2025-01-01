import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import Feedback from './components/Feedback/Feedback';
import Navigate from './components/Navigate';
import Select from './components/Select/Select';
import { Icon } from '@iconify/react';

const ITEM_TYPE = 'CANVAS_ITEM';

function DraggableCanvas({ canvas, index, moveCanvas, setCurrentCanvas, deleteCanvas }) {
  const [, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { index },
  });

  const [, dropRef] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCanvas(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => dragRef(dropRef(node))}
      className="canvas-item"
    >
      <div className="canvas-preview" onClick={() => setCurrentCanvas(canvas.id)}>
        Canvas {index + 1}
      </div>
      <Icon
        icon="mdi:trash"
        width="24"
        height="24"
        className="delete-icon"
        onClick={() => deleteCanvas(canvas.id)}
      />
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('select');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [currentCanvas, setCurrentCanvas] = useState(null);  // Manage current canvas

  // Load data from localStorage
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

  // Save updated data to localStorage
  const updateSlideData = (updatedSlide) => {
    const updatedSlides = slides.map((slide) =>
      slide.id === updatedSlide.id ? updatedSlide : slide
    );
    setSlides(updatedSlides);
    localStorage.setItem(
      'SlideWonderdata',
      JSON.stringify({ slides: updatedSlides })
    );
  };

  const addCanvasToDeck = () => {
    const newCanvas = {
      id: Date.now(), 
      content: null,
    };

    const updatedSlide = {
      ...currentSlide,
      deck: [...currentSlide.deck, newCanvas],
    };

    updateSlideData(updatedSlide);
  };

  const deleteCanvas = (canvasId) => {
    const updatedDeck = currentSlide.deck.filter((canvas) => canvas.id !== canvasId);
    const updatedSlide = { ...currentSlide, deck: updatedDeck };
    updateSlideData(updatedSlide);
  };

  const moveCanvas = (fromIndex, toIndex) => {
    const updatedDeck = [...currentSlide.deck];
    const [movedCanvas] = updatedDeck.splice(fromIndex, 1);
    updatedDeck.splice(toIndex, 0, movedCanvas);

    const updatedSlide = { ...currentSlide, deck: updatedDeck };
    updateSlideData(updatedSlide);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Navigate toggleFeedbackModal={() => setIsModalOpen(!isModalOpen)} />
        <div className="title">SlideWonder</div>

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
          <div className="main-container">
            <div className="scrollable-column">
              <div className="canvas-list">
                {currentSlide?.deck.map((canvas, index) => (
                  <DraggableCanvas
                    key={canvas.id}
                    index={index}
                    canvas={canvas}
                    moveCanvas={moveCanvas}
                    setCurrentCanvas={setCurrentCanvas}  // Pass setCurrentCanvas here
                    deleteCanvas={deleteCanvas}
                  />
                ))}
              </div>
              <button onClick={addCanvasToDeck}>Add Canvas</button>
            </div>
            <div className="canvas-container">
              <Icon
                icon="mingcute:back-line"
                width="24"
                height="24"
                onClick={() => setView('select')}
              />
              <canvas id="fabric-canvas" width="800" height="600"></canvas>
            </div>
          </div>
        )}

        {isModalOpen && (
          <Feedback isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        )}
      </div>
    </DndProvider>
  );
}

export default App;
