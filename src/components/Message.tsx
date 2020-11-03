import { Box, Theme, Typography } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { Message as MessageAPI } from '../graphql/generated/graphql';

type MessageProps = {
  msg: MessageAPI;
};

const Message: React.FC<MessageProps> = ({ msg }) => {
  const { user } = useUserContext();

  const isCurrentUserMessage = user === msg.createdBy;

  const MessagesBox = withStyles(({ spacing }: Theme) => ({
    root: {
      backgroundColor: isCurrentUserMessage ? blue[500] : grey[300],
      color: isCurrentUserMessage ? 'white' : 'inherit',

      borderRadius: '20px',
      marginBottom: spacing(1),
      padding: spacing(1),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      maxWidth: '60%',
      width: 'fit-content',
    },
  }))(Box);

  const AuthorLabel = withStyles(({ spacing }: Theme) => ({
    root: {
      paddingLeft: `calc(${spacing(1)}px + 4px)`,
      paddingRight: `calc(${spacing(1)}px + 4px)`,
      color: grey[500],
    },
  }))(Typography);

  return (
    <Box display="flex" flexDirection="column" alignItems={isCurrentUserMessage ? 'flex-end' : 'start'}>
      <AuthorLabel variant="caption">{msg.createdBy}</AuthorLabel>
      <Box display="flex" alignItems="baseline" flexDirection={isCurrentUserMessage ? 'row-reverse' : 'row'}>
        <MessagesBox>{msg.content}</MessagesBox>
        <Box px={1}>
          <Typography style={{ color: grey[500] }} variant="caption">
            {new Date(msg.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
