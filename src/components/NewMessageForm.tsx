import { Box, Card, IconButton, InputBase, Tooltip } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { useTheme } from '@material-ui/styles';
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
        <Box p={1} px={2} style={{ borderRadius: '15px', border: `1px solid ${grey[400]}` }}>
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
      </Box>

      <Box pl={2}>
        <Tooltip title="Send Message">
          <IconButton onClick={submit}>
            <Send />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default NewMessageForm;
