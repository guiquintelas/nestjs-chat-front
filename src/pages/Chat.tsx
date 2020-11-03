import { Box, Card, Divider, Grid, IconButton, InputBase, makeStyles, Theme, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Send } from 'mdi-material-ui';
import Layout from '../components/Layout';
import { useSnackBarContext } from '../contexts/SnackBarContext';
import { useUserContext } from '../contexts/UserContext';
import { useChatContext } from '../contexts/ChatContext';
import Message from '../components/Message';

const ChatMessagesBox = withStyles({
  root: {
    height: '0px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
})(Box);

const ChatWrapperGrid = withStyles((theme: Theme) => ({
  root: {
    overflowY: 'hidden',
    [theme.breakpoints.up('sm')]: {
      height: '80vh',
      maxHeight: '80vh',
    },
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 56px)`,
      maxHeight: `calc(100vh - 56px)`,
      flexDirection: 'column',
    },
  },
}))(Grid);

const ChatColumnGrid = withStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      height: '100%',
    },
  },
}))(Grid);

const useStyles = makeStyles((theme: Theme) => ({
  chatUsersColumn: {
    [theme.breakpoints.down('sm')]: {
      flex: '0 1 0%',
    },
  },

  chatColumn: {
    [theme.breakpoints.down('sm')]: {
      height: '0px',
      flex: '1 1 0%',
    },
  },
}));

const Chat: React.FC = () => {
  const { user } = useUserContext();
  const { chatUsers, messages } = useChatContext();
  const classes = useStyles();
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
      <ChatWrapperGrid container item spacing={2}>
        <ChatColumnGrid item md={3} xs={12} className={classes.chatUsersColumn}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6">Users in Chat</Typography>
            </Grid>
            {chatUsers.map((chatUser) => (
              <Grid item sm={12} key={chatUser}>
                {chatUser}
              </Grid>
            ))}
          </Grid>
        </ChatColumnGrid>

        <ChatColumnGrid item md={9} xs={12} className={classes.chatColumn}>
          <Card elevation={4} style={{ height: '100%', position: 'relative' }}>
            <Box p={2} display="flex" flexDirection="column" height="100%">
              <ChatMessagesBox flex="1">
                {messages.map((msg) => (
                  <Message key={msg.id} msg={msg} />
                ))}
              </ChatMessagesBox>

              <Box mx={-2}>
                <Divider />
              </Box>

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
        </ChatColumnGrid>
      </ChatWrapperGrid>
    </Layout>
  );
};

export default Chat;
