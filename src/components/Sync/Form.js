import React, {useState} from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText,TextField } from '@mui/material';
import { Icon } from '@iconify/react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import PasswordStrength from './PasswordStrength';
const Form = ({auth,setUser}) => {
 const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
 
  const googleProvider = new GoogleAuthProvider();
   const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isSignUp) {
        await auth.createUserWithEmailAndPassword(email, password);
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      setUser(auth.currentUser); 
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const handleSwitchAuthMode = () => {
    setIsSignUp((prevState) => !prevState);
  };


  const handleSignInWithGoogle = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      const user = result.user;
      setUser(user);
    }).catch((error) => {
      console.error("Error during Google sign-in:", error.message);
    });
  };


  return (
  <div>
    <Typography variant="h5" gutterBottom>
          Sign In
        </Typography>
  
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<Icon icon="flat-color-icons:google" width="24" height="24" />}
          onClick={handleSignInWithGoogle}
          style={{marginBottom: '2.5rem'}}
        >
          Sign In with Google
        </Button>

   

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        <div  style={{ display: isSignUp ? 'block' : 'none' }}>
        <PasswordStrength password={password} />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ marginBottom: 2, marginTop: 2  }}
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>

      <Button onClick={handleSwitchAuthMode} fullWidth>
        {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
      </Button>
      </div>
  );
};

export default Form;
