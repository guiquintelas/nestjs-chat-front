import { Box, Card, Divider, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import Message from '../components/Message';
import NewMessageForm from '../components/NewMessageForm';
import { useChatContext } from '../contexts/ChatContext';
import MessageProvider from '../contexts/MessageContext';
import { useSnackBarContext } from '../contexts/SnackBarContext';
import { useUserContext } from '../contexts/UserContext';

const ChatMessagesBox = withStyles(({ spacing }: Theme) => ({
  root: {
    height: '0px',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingRight: spacing(1),
  },
}))(Box);

const ChatWrapperGrid = withStyles((theme: Theme) => ({
  root: {
    overflowY: 'hidden',
    [theme.breakpoints.up('sm')]: {
      height: '90vh',
      maxHeight: '90vh',
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
                <MessageProvider>
                  {messages.map((msg, idx) => (
                    <Message key={msg.id} msg={msg} previousMsg={messages[idx - 1] ?? undefined} />
                  ))}
                </MessageProvider>
              </ChatMessagesBox>

              <Box mx={-2}>
                <Divider />
              </Box>

              <Box pt={2}>
                <NewMessageForm />
              </Box>
            </Box>
          </Card>
        </ChatColumnGrid>
      </ChatWrapperGrid>
    </Layout>
  );
};

export default Chat;
