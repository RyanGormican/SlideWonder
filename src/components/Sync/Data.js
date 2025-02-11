import React, {useState,useEffect} from 'react';
import { Box, Typography, Dialog, Button, DialogContent, DialogActions, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';
import * as SelectUtility from '../Select/SelectUtility';
import { ref, uploadString, getMetadata, getDownloadURL } from 'firebase/storage'; 
const Data = ({user,fileLastModified,setFileLastModified,storage,setSlides,setPins,setTags,setTheme,setPersonalTemplates,setModulars}) => {
  const [fileStatus, setFileStatus] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [hoveredDate, setHoveredDate] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);  
  const [actionToConfirm, setActionToConfirm] = useState(null); 
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
        setPersonalTemplates(savedData.personaltemplates || []);
        setModulars (savedData.modulars || []);
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
     <Box>
        <Typography variant="body1">
          <Box sx={{ display: fileStatus === 'No file exists' ? 'block' : 'none' }}>
            {fileStatus}
          </Box>

          <Box sx={{ display: fileLastModified ? 'block' : 'none' }}>
            <div
              onMouseEnter={() => setHoveredDate('modified')}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <strong>Last Modified: </strong>
              {hoveredDate === 'modified'
                ? SelectUtility.formatDate(fileLastModified)
                : SelectUtility.timeAgo(fileLastModified)}
            </div>
          </Box>

          {fileStatus === 'File exists' && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => openDialog('download')}
              sx={{ marginBottom: 2 }}
            >
              DOWNLOAD <Icon color="white" icon="material-symbols:download" width="24" height="24" />
            </Button>
          )}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleRefresh}
          sx={{ marginBottom: 2 }}
        >
          REFRESH <Icon color="white" icon="material-symbols:refresh" width="24" height="24" />
        </Button>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => openDialog('upload')}
        >
          UPLOAD <Icon color="white" icon="material-symbols:upload" width="24" height="24" />
        </Button>
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

export default Data;
