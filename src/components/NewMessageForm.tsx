import { Box, Card, IconButton, InputBase } from '@material-ui/core';
import { Send } from 'mdi-material-ui';
import React, { useState } from 'react';
import { useChatContext } from '../contexts/ChatContext';

const NewMessageForm: React.FC = () => {
  const [content, setContent] = useState('');

  const { sendMessage } = useChatContext();

  const submit = async () => {
    await sendMessage(content);
    setContent('');
  };

  return (
    <Box display="flex" height="100%">
      <Box flex="1">
        <Card>
          <Box p={1} px={2}>
            <InputBase
              placeholder="Type your message ..."
              style={{ margin: 0, width: '100%' }}
              value={content}
              onChange={(e) => {
                setContent(e.currentTarget.value);
              }}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  await submit();
                }
              }}
            />
          </Box>
        </Card>
      </Box>

      <Box pl={2}>
        <IconButton onClick={submit}>
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default NewMessageForm;
