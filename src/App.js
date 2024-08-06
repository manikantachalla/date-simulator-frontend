import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box, CircularProgress, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, CardActions } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';

const apiHost = "https://gen-ai-mani-c0bb28203a46.herokuapp.com";

const App = () => {
  const [sessionId, setSessionId] = useState('');
  const [character, setCharacter] = useState('');
  const [scene, setScene] = useState('');
  const [characterQualities, setCharacterQualities] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [reply, setReply] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // State for confirmation dialog
  const [showDetails, setShowDetails] = useState(false); // State for toggling session details visibility

  const createSession = async () => {
    try {
      const response = await axios.post(`${apiHost}/create-session`, {
        character,
        scene,
        characterQualities,
        initialMessage
      });
      setSessionId(response.data.sessionId);
      fetchImage(response.data.sessionId);
      setOpenDialog(true); // Open confirmation dialog
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(`${apiHost}/chat`, {
        userMessage,
        sessionId
      });
      setReply(response.data.reply);
      fetchImage(sessionId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchImage = async (sessionId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiHost}/api/get-image`, {
        params: { sessionId },
        responseType: 'blob'
      });
      const imageUrl = URL.createObjectURL(response.data);
      setImage(imageUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const toggleDetailsVisibility = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <Container sx={{ transform: 'scale(0.75)', transformOrigin: '0 0', width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        DATE SIMULATOR
      </Typography>
      <Paper style={{ padding: 16 }}>
        {(!sessionId || showDetails) && (
          <Box mb={2}>
            <TextField
              label="Character"
              fullWidth
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              margin="normal"
              InputProps={{ readOnly: !isEditing }}
            />
            <TextField
              label="Scene"
              fullWidth
              value={scene}
              onChange={(e) => setScene(e.target.value)}
              margin="normal"
              InputProps={{ readOnly: !isEditing }}
            />
            <TextField
              label="Character Qualities"
              fullWidth
              value={characterQualities}
              onChange={(e) => setCharacterQualities(e.target.value)}
              margin="normal"
              InputProps={{ readOnly: !isEditing }}
            />
            <TextField
              label="Initial Message"
              fullWidth
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              margin="normal"
              InputProps={{ readOnly: !isEditing }}
            />
            <Button variant="contained" color="primary" onClick={createSession}>
              Create Scene
            </Button>
            {sessionId && !isEditing && (
              <IconButton onClick={handleEditClick} style={{ marginLeft: 16 }}>
                <EditIcon />
              </IconButton>
            )}
            {sessionId && isEditing && (
              <IconButton onClick={handleSaveClick} style={{ marginLeft: 16 }}>
                <CheckIcon />
              </IconButton>
            )}
          </Box>
        )}
        {sessionId && (
          <Box mb={2}>
            <Button variant="contained" color="secondary" onClick={toggleDetailsVisibility}>
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
            {
              <Box mt={2}>
                <TextField
                  label="Your Message"
                  fullWidth
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  margin="normal"
                />
                <Button variant="contained" color="primary" onClick={sendMessage}>
                  Respond
                </Button>
                {reply && (
                  <Box mt={2}>
                    <Typography variant="h6">Reply:</Typography>
                    <Typography>{reply}</Typography>
                  </Box>
                )}
                <Box mt={2}>
                  <Typography variant="h6">Generated Image:</Typography>
                  {loading ? (
                    <Box mt={2} display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  ) : (
                    image && <img src={image} alt="Generated" style={{ marginTop: 16, width: '100%', maxHeight: '400px' }} />
                  )}
                </Box>
              </Box>
            }
          </Box>
        )}
      </Paper>
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Scene Created</DialogTitle>
        <DialogContent>
          <Typography variant="body1">The scene has been created successfully.</Typography>
          <Card style={{ marginTop: 16 }}>
            <CardContent>
              <Typography variant="h6">Scene Details</Typography>
              <Typography><strong>Character:</strong> {character}</Typography>
              <Typography><strong>Scene:</strong> {scene}</Typography>
              <Typography><strong>Character Qualities:</strong> {characterQualities}</Typography>
              <Typography><strong>Initial Message:</strong> {initialMessage}</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={handleCloseDialog} color="primary">
                OK
              </Button>
            </CardActions>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
