import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

function Index() {
  const [theme, setTheme] = useState('light'); 

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : 'dark-mode';
  }, [theme]);

  return <App theme={theme} setTheme={setTheme}/>;
}

root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
