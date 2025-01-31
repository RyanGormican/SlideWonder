// pages/index.js
import App from '../src/App.js'; 

export default function HomePage({ theme, setTheme }) {
  return <App theme={theme} setTheme={setTheme} />;
}
