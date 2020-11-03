import { Box, Theme, Typography } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/styles';
import React, { useEffect, useRef } from 'react';
import { useChatContext } from '../contexts/ChatContext';
import { useMessageContext } from '../contexts/MessageContext';
import { useUserContext } from '../contexts/UserContext';
import { Message as MessageAPI } from '../graphql/generated/graphql';

type MessageProps = {
  msg: MessageAPI;
  previousMsg?: MessageAPI;
};

const useNewMessageScrollRef = (msg: MessageAPI) => {
  const { messages } = useChatContext();
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastItem = messages[messages.length - 1] ?? false;

    if (lastItem && lastItem.id === msg.id) {
      // eslint-disable-next-line no-unused-expressions
      messageRef.current?.scrollIntoView();
    }
  }, [messages]);

  return messageRef;
};

const Message: React.FC<MessageProps> = ({ msg, previousMsg }) => {
  const { user } = useUserContext();
  const { isHovering, setHovering } = useMessageContext(msg);
  const messageRef = useNewMessageScrollRef(msg);

  const isCurrentUserMessage = user === msg.createdBy;
  const isSameMessageUser = previousMsg?.createdBy === msg.createdBy;

  const MessagesBox = withStyles(({ spacing }: Theme) => ({
    root: {
      backgroundColor: isCurrentUserMessage ? blue[500] : grey[300],
      color: isCurrentUserMessage ? 'white' : 'inherit',

      borderRadius: '15px',
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
    <div ref={messageRef}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems={isCurrentUserMessage ? 'flex-end' : 'start'}
        mt={isSameMessageUser ? '-5px' : 0}
        mb={1}
      >
        {!isSameMessageUser && <AuthorLabel variant="caption">{msg.createdBy}</AuthorLabel>}
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          flexDirection={isCurrentUserMessage ? 'row-reverse' : 'row'}
        >
          <MessagesBox
            onMouseEnter={() => {
              setHovering(true);
            }}
            onMouseLeave={() => {
              setHovering(false);
            }}
          >
            {msg.content}
          </MessagesBox>
          {isHovering ? (
            <Box px={1}>
              <Typography style={{ color: grey[500] }} variant="caption">
                {new Date(msg.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
    </div>
  );
};

export default Message;
