import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Head from 'next/head'; 
import Script from 'next/script'; 
import '../styles/globals.css';

const muiTheme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        component: 'div',
      },
    },
    MuiMenuItem: {
      defaultProps: {
        component: 'div',
      },
    },
    MuiCardContent: {
      defaultProps: {
        component: 'div',
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  const [themeMode, setThemeMode] = useState('light');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
      const storedTheme = savedData.settings?.theme || 'light';  
      setThemeMode(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.body.className = themeMode === 'light' ? 'light-mode' : 'dark-mode';
  }, [themeMode]);

  return (
    <>
      <Head>

        <html lang="en" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="SlideWonder: Web app for creating customizable presentations with drag and drop functionality. Create multimedia, interactive, and educational slide decks using React and Fabric.js." />
        <meta name="google-site-verification" content="O2QkssZfWtjEBcaSjNOnuGjCyW9qqBIAq32Oy9hgtnM" />

        {/* Open Graph Meta Tags for better social sharing */}
        <meta property="og:title" content="SlideWonder" />
        <meta property="og:description" content="Create interactive and multimedia presentations with ease. Drag and drop to design slide decks in a user-friendly interface." />
        <meta property="og:image" content="/logo192.png" />

        {/* Apple Touch Icon with multiple sizes */}
        <link rel="apple-touch-icon" href="/logo192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/logo512.png" sizes="512x512" />

        {/* Preconnect and Preload Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

        {/* Manifest for Web App */}
        <link rel="manifest" href="/manifest.json" />

        <title>SlideWonder</title>

        {/* SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="web app, presentation software, create presentations, customizable slides, drag and drop, online slide management, educational tools, visual presentations, interactive slides, multimedia presentations, React app, Fabric.js, slide deck creation, web application, user-friendly interface" />

        {/* Link for Google Fonts preload */}
        <link rel="stylesheet preload" href="https://fonts.googleapis.com/css2?family=Baskervville+SC&family=Quicksand:wght@300..700&family=Goblin+One&display=swap&font-display=swap" as="style" />
      </Head>
      
      {/* Google Analytics Script */}
      <Script 
        strategy="afterInteractive" 
        src="https://www.googletagmanager.com/gtag/js?id=G-2JTMBMXKNL" 
        async 
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2JTMBMXKNL');
          `,
        }}
      />

      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Component {...pageProps} theme={themeMode} setTheme={setThemeMode} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
