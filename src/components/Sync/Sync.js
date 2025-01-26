import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp, storage, auth } from '../../firebaseConfig';
import { Button, Typography, Box, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Icon } from '@iconify/react';
import { ref, uploadString, getMetadata, getDownloadURL } from 'firebase/storage'; 
import * as SelectUtility from '../Select/SelectUtility';

const Sync = ({ slides, setSlides, pins, setPins, tags, setTags, user, setUser, theme, setTheme , fileLastModified,setFileLastModified }) => {
  const [fileStatus, setFileStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);  
  const [actionToConfirm, setActionToConfirm] = useState(null); 
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const [hoveredDate, setHoveredDate] = useState(false);

  // Handle SignOut and SignIn
  const handleSignOut = () => {
    auth.signOut();
    setUser(null);
  };

  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      const user = result.user;
      setUser(user);
    }).catch((error) => {
      console.error("Error during Google sign-in:", error.message);
    });
  };

  // Check if the file exists in Firebase Storage
  useEffect(() => {
    if (user) {
      const fileName = `SlideWonderdata.${user.uid}.json`;
      const fileRef = ref(storage, fileName);

      getMetadata(fileRef)
        .then((metadata) => {
          setFileStatus('File exists');
          setFileLastModified(new Date(metadata.updated).getTime());
        })
        .catch((error) => {
          if (error.code === 'storage/object-not-found') {
            setFileStatus('No file exists');
            setFileLastModified('');
            setDownloadUrl('');
          } else {
            console.error('Error fetching file metadata:', error);
          }
        });
    }
  }, [user,fileStatus]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  }, []);

  // UPLOAD Button handler
  const handleUpload = async () => {
    if (user) {
      const fileName = `SlideWonderdata.${user.uid}.json`;
      const fileRef = ref(storage, fileName);

      const storedData = localStorage.getItem('SlideWonderdata');

      if (storedData) {
        const jsonData = JSON.stringify(JSON.parse(storedData));

        try {
          await uploadString(fileRef, jsonData, 'raw', { contentType: 'application/json' });
          setFileStatus(`File exists at ${Date.now()}`);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      } else {

      }
    }
  };

  // DOWNLOAD Button handler
  const handleDownload = async () => {
    if (user) {
      const fileName = `SlideWonderdata.${user.uid}.json`;
      const fileRef = ref(storage, fileName);

      try {
        const url = await getDownloadURL(fileRef);
        setDownloadUrl(url);
        const response = await fetch(url);
        const fileData = await response.json();
        localStorage.setItem('SlideWonderdata', JSON.stringify(fileData));
        const savedData = JSON.parse(localStorage.getItem('SlideWonderdata')) || {};
        setSlides(savedData.slides || []);
        setPins(savedData.pins || []);
        setTags(savedData.tags || []);
        setTheme(savedData.settings?.theme || 'light');
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    }
  };

  const handleRefresh = async () => {
    setFileStatus(`File sync at ${Date.now()}`);
  };


  const openDialog = (action) => {
    setActionToConfirm(action);
    setOpenConfirmDialog(true);
  };


  const closeDialog = () => {
    setOpenConfirmDialog(false);
    setActionToConfirm(null);
  };


  const confirmAction = () => {
    if (actionToConfirm === 'upload') {
      handleUpload();
    } else if (actionToConfirm === 'download') {
      handleDownload();
    }
    closeDialog();
  };

  return (
    <Box sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper sx={{ padding: 3, textAlign: 'center', width: 320 }} style={{ border: '1px solid black' }}>
        <Box style={{ display: user ? 'block' : 'none' }}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSignOut}>
            Sign Out <Icon color="white" icon="uil:signout" width="24" height="24" />
          </Button>
          <Typography variant="body1">
            <Box style={{ display: fileStatus === 'No file exists' ? 'block' : 'none' }}>
              {fileStatus}
            </Box>
            <br />
            {fileLastModified && (
              <div onMouseEnter={() => setHoveredDate('modified')} onMouseLeave={() => setHoveredDate(null)}>
                <strong>Last Modified: </strong>
                {hoveredDate === 'modified'
                  ? SelectUtility.formatDate(fileLastModified)
                  : SelectUtility.timeAgo(fileLastModified)}
              </div>
            )}
            {fileStatus === 'File exists' && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => openDialog('download')}
                style={{ marginBottom: 5 }}
              >
                DOWNLOAD <Icon color="white" icon="material-symbols:download" width="24" height="24" />
              </Button>
            )}
          </Typography>

          <Button variant="contained" color="primary" fullWidth onClick={handleRefresh} style={{ marginBottom: 5 }}>
            REFRESH <Icon color="white" icon="material-symbols:refresh" width="24" height="24" />
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={() => openDialog('upload')}>
            UPLOAD <Icon color="white" icon="material-symbols:upload" width="24" height="24" />
          </Button>
        </Box>

        <Box style={{ display: user ? 'none' : 'block' }}>
          <Typography variant="h6" gutterBottom>
            Sign In
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={<Icon icon="flat-color-icons:google" width="24" height="24" />}
            onClick={handleSignInWithGoogle}
          >
            Sign In with Google
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={closeDialog}>
        <DialogContent>
          <Typography>Do you want to {actionToConfirm} your data?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Sync;