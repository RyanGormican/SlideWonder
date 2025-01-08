export function Keybinds({ currentSlide, currentCanvasIndex, setCurrentCanvasIndex, setView, loop, goToNextCanvas, goToPreviousCanvas, toggleFullscreen }) {
  return (e) => {
    switch (e.key) {
      case 'Escape':
        setView('slide');
        break;
      case 'ArrowRight':
      case 'Enter':
      case ' ':
        goToNextCanvas();
        break;
      case 'ArrowLeft':
      case 'Shift+ ':
        goToPreviousCanvas();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'Home':
        setCurrentCanvasIndex(0);
        break;
      case 'End':
        setCurrentCanvasIndex(currentSlide.deck.length - 1);
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        const slideIndex = parseInt(e.key) - 1;
        if (slideIndex < currentSlide.deck.length) {
          setCurrentCanvasIndex(slideIndex);
        }
        break;
      default:
        break;
    }
  };
}
