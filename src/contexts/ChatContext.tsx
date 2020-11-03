import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  MessagesQuery,
  useChatEnterMutation,
  useChatLeaveMutation,
  useChatListUsersQuery,
  useChatUserEnteredSubscription,
  useChatUserLeavedSubscription,
  useMessagesQuery,
  useNewMessageSubscription,
} from '../graphql/generated/graphql';
import { useSnackBarContext } from './SnackBarContext';

export type Message = MessagesQuery['messages'][0];

type ChatContextType = {
  messages: Message[];
  chatUsers: string[];
  enterChat: (nickname: string) => Promise<void>;
  leaveChat: (nickname: string) => Promise<void>;
};

export const ChatContext = createContext<ChatContextType>({
  chatUsers: [],
  messages: [],
  enterChat: () => {
    throw new Error('you should only use this context inside the provider!');
  },
  leaveChat: () => {
    throw new Error('you should only use this context inside the provider!');
  },
});

const useChatUsers = () => {
  const { snackBar } = useSnackBarContext();
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const { data: userEntered } = useChatUserEnteredSubscription();
  const { data: userLeaved } = useChatUserLeavedSubscription();
  const { data: initialChatUsers } = useChatListUsersQuery();

  useEffect(() => {
    if (initialChatUsers?.chatListUsers) {
      setChatUsers(initialChatUsers.chatListUsers);
    }
  }, [initialChatUsers]);

  useEffect(() => {
    if (!userEntered?.chatUserEntered) {
      return;
    }

    setChatUsers([...chatUsers, userEntered.chatUserEntered]);
    snackBar(`The user ${userEntered.chatUserEntered} has joined!`);
  }, [userEntered]);

  useEffect(() => {
    if (!userLeaved?.chatUserLeaved) {
      return;
    }

    setChatUsers(chatUsers.filter((el) => el !== userLeaved.chatUserLeaved));
    snackBar(`The user ${userLeaved.chatUserLeaved} has leaved the chat!`);
  }, [userLeaved]);

  return {
    chatUsers,
  };
};

const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: initialMessages } = useMessagesQuery();
  const { data } = useNewMessageSubscription();

  useEffect(() => {
    if (initialMessages?.messages) {
      setMessages(initialMessages.messages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (data?.messageSent) {
      setMessages([...messages, data.messageSent]);
    }
  }, [data]);

  return {
    messages,
  };
};

const ChatProvider: React.FC = ({ children }) => {
  const { chatUsers } = useChatUsers();
  const { messages } = useMessages();
  const [enterChat] = useChatEnterMutation();
  const [leaveChat] = useChatLeaveMutation();

  return (
    <ChatContext.Provider
      value={{
        messages,
        chatUsers,

        async enterChat(nickname) {
          await enterChat({
            variables: {
              nickname,
            },
          });
        },

        async leaveChat(nickname) {
          await leaveChat({
            variables: {
              nickname,
            },
          });
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;

export function useChatContext() {
  return useContext(ChatContext);
}
