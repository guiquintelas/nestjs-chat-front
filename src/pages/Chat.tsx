import { Box, Card, Grid, IconButton, Input, InputBase, TextField, Theme, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Send } from 'mdi-material-ui';
import Layout from '../components/Layout';
import { useSnackBarContext } from '../contexts/SnackBarContext';
import { useUserContext } from '../contexts/UserContext';

const ChatMessagesBox = withStyles({
  root: {
    height: '0px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
})(Box);

const Chat: React.FC = () => {
  const { user } = useUserContext();
  const history = useHistory();
  const { snackBar } = useSnackBarContext();

  useEffect(() => {
    if (!user) {
      history.push('/login');
      snackBar('Please choose your nickname before entering the chat!', 'danger');
    }
  }, []);

  return (
    <Layout>
      <Grid container item style={{ height: '80vh', maxHeight: '80vh' }} spacing={2}>
        <Grid item md={3} xs={3} style={{ height: '100%' }}>
          <Box mt={2}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography variant="h6">Users in Chat</Typography>
              </Grid>
              <Grid item>user1</Grid>
              <Grid item>user2</Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item md={9} xs={9} style={{ height: '100%' }}>
          <Card elevation={4} style={{ height: '100%', position: 'relative' }}>
            <Box p={2} display="flex" flexDirection="column" height="100%">
              <ChatMessagesBox flex="1">
                <Grid container direction="column" spacing={2}>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                  <Grid item>teste</Grid>
                </Grid>
              </ChatMessagesBox>

              <Box pt={2}>
                <Box display="flex" height="100%">
                  <Box flex="1">
                    <Card>
                      <Box p={1} px={2}>
                        <InputBase placeholder="Type your message ..." style={{ margin: 0, width: '100%' }} />
                      </Box>
                    </Card>
                  </Box>

                  <Box pl={2}>
                    <IconButton>
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Chat;
