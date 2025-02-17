import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp, storage, auth } from '../../firebaseConfig';
import { Button, Typography, Box, Paper, Dialog, DialogActions, TextField, DialogContent, DialogTitle } from '@mui/material';
import { Icon } from '@iconify/react';
import CallToAction from './CallToAction';
import Data from './Data';
import Form from './Form';
const Sync = ({ slides, setSlides, pins, setPins, tags, setTags, user, setUser, theme, setTheme ,personalTemplates, setPersonalTemplates, setModulars, fileLastModified,setFileLastModified }) => {
  
  const auth = getAuth();

  
  const [syncSpace, setSyncSpace] = useState('data')
  const handleSignOut = () => {
    auth.signOut();
    setUser(null);
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);


  return (
  <div>
  <div style={{ display: user ? 'none' : 'block' }}> 
  <CallToAction />
  </div>
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
    
    <Paper sx={{ padding: 3, textAlign: 'center', width: 320, border: '1px solid black' }}>
      <Box sx={{ display: user ? 'block' : 'none' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignOut}
          sx={{ marginBottom: 2 }}
        >
          Sign Out <Icon color="white" icon="uil:signout" width="24" height="24" />
        </Button>
        <div style={{ display: 'flex', gap: '10px', display:'none' }}>
  <Button
    variant="contained"
    color={syncSpace === 'data' ? 'secondary' : 'primary'}
    fullWidth
    sx={{
      marginBottom: 2,
      backgroundColor: syncSpace === 'data' ? '#1976d2' : '#757575', 
      '&:hover': { backgroundColor: syncSpace === 'data' ? '#1565c0' : '#616161' },
    }}
    onClick={() => setSyncSpace('data')}
  >
    Data <Icon icon="material-symbols:storage" color="white" width="24" height="24" />
  </Button>
  
  <Button
    variant="contained"
    color={syncSpace === 'creative' ? 'secondary' : 'primary'}
    fullWidth
    sx={{
      marginBottom: 2,
      backgroundColor: syncSpace === 'creative' ? '#1976d2' : '#757575', 
      '&:hover': { backgroundColor: syncSpace === 'creative' ? '#1565c0' : '#616161' },
    }}
    onClick={() => setSyncSpace('creative')}
  >
    Creative <Icon icon="mdi:paint-outline" color="white" width="24" height="24" />
  </Button>
</div>


      <div  style={{ display: syncSpace === 'data' ? 'block' : 'none' }} >
      <Data user={user} fileLastModified={fileLastModified} setFileLastModified={setFileLastModified} storage={storage} setSlides={setSlides} setPins={setPins} setTags={setTags} setTheme={setTheme} setPersonalTemplates={setPersonalTemplates} setModulars={setModulars}/>
      </div>
      </Box>
      <Box sx={{ display: user ? 'none' : 'block' }}>
      <Form auth={auth} setUser={setUser}/>
      </Box>
    </Paper>
   
    
    </Box>
    </div>
  );
};
export default Sync;