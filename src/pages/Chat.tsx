import { Box, Divider, Grid, makeStyles, Paper, Theme, Tooltip, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/styles';
import { Brightness1 } from 'mdi-material-ui';
import React from 'react';
import Layout from '../components/Layout';
import Message from '../components/Message';
import NewMessageForm from '../components/NewMessageForm';
import { useChatContext } from '../contexts/ChatContext';

const ChatMessagesBox = withStyles(() => ({
  root: {
    height: '0px',
    overflowY: 'auto',
    overflowX: 'hidden',
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
  const { chatUsers, messages, onlineChatUsers } = useChatContext();
  const classes = useStyles();

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
                <Box display="flex" alignItems="center">
                  <Box>{chatUser}</Box>

                  {onlineChatUsers.includes(chatUser) && (
                    <Box ml={1} height={20}>
                      <Tooltip title="Online">
                        <Brightness1 style={{ fontSize: '12px', color: green[400], marginTop: '3px' }} />
                      </Tooltip>
                    </Box>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </ChatColumnGrid>

        <ChatColumnGrid item md={9} xs={12} className={classes.chatColumn}>
          <Paper elevation={4} style={{ height: '100%', position: 'relative' }}>
            <Box display="flex" flexDirection="column" height="100%">
              <ChatMessagesBox flex="1" pt={2}>
                {messages.map((msg, idx) => (
                  <Message key={msg.id} msg={msg} previousMsg={messages[idx - 1] ?? undefined} />
                ))}
              </ChatMessagesBox>

              <Divider />

              <Box p={2}>
                <NewMessageForm />
              </Box>
            </Box>
          </Paper>
        </ChatColumnGrid>
      </ChatWrapperGrid>
    </Layout>
  );
};

export default Chat;
