import React, { createContext, useContext, useEffect, useState } from 'react';
import { MessagesQuery } from '../graphql/generated/graphql';

export type Message = MessagesQuery['messages'][0];

type MessageContextType = {
  currentHoveredMessage?: Message;
  setCurrentHoveredMessage: (msg: Message) => void;
};

export const ChatContext = createContext<MessageContextType>({
  setCurrentHoveredMessage() {
    throw new Error('you should only use this context inside the provider!');
  },
});

const MessageProvider: React.FC = ({ children }) => {
  const [currentHoveredMessage, setCurrentHoveredMessage] = useState<Message>();

  return (
    <ChatContext.Provider value={{ currentHoveredMessage, setCurrentHoveredMessage }}>{children}</ChatContext.Provider>
  );
};

export default MessageProvider;

export function useMessageContext(msg: Message) {
  const ctx = useContext(ChatContext);

  const [isHovering, setHovering] = useState(false);

  useEffect(() => {
    if (ctx.currentHoveredMessage?.id !== msg.id) {
      setHovering(false);
    }
  }, [ctx.currentHoveredMessage]);

  return {
    ...ctx,
    isHovering,
    setHovering: (value: boolean) => {
      setHovering(value);
      if (value) {
        ctx.setCurrentHoveredMessage(msg);
      }
    },
  };
}
