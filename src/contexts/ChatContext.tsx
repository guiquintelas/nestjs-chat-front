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
  useSendMessageMutation,
} from '../graphql/generated/graphql';
import { useSnackBarContext } from './SnackBarContext';

export type Message = MessagesQuery['messages'][0];

type ChatContextType = {
  messages: Message[];
  chatUsers: string[];
  enterChat: (nickname: string) => Promise<void>;
  leaveChat: (nickname: string) => Promise<void>;
  sendMessage: (content: string, nickname: string) => Promise<void>;
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
  sendMessage: () => {
    throw new Error('you should only use this context inside the provider!');
  },
});

// hook to separate specific ChatUser logic from provider
const useChatUsers = () => {
  const { snackBar } = useSnackBarContext();
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const { data: userEntered } = useChatUserEnteredSubscription();
  const { data: userLeaved } = useChatUserLeavedSubscription();
  const { data: chatUsersRes, refetch: fetchChatUsers } = useChatListUsersQuery();

  // fetch chat users in app startup
  useEffect(() => {
    if (chatUsersRes?.chatListUsers) {
      setChatUsers(chatUsersRes.chatListUsers);
    }
  }, [chatUsersRes]);

  // handles new user subscription event
  // - add to chatUsers
  // - alerts current user via snackbar
  useEffect(() => {
    if (!userEntered?.chatUserEntered) {
      return;
    }

    setChatUsers([...chatUsers, userEntered.chatUserEntered]);
    snackBar(`The user ${userEntered.chatUserEntered} has joined!`);
  }, [userEntered]);

  // handles user leaving chat subscription event
  // - remove it from chatUsers
  // - alerts current user via snackbar
  useEffect(() => {
    if (!userLeaved?.chatUserLeaved) {
      return;
    }

    setChatUsers(chatUsers.filter((el) => el !== userLeaved.chatUserLeaved));
    snackBar(`The user ${userLeaved.chatUserLeaved} has leaved the chat!`);
  }, [userLeaved]);

  return {
    chatUsers,
    fetchChatUsers,
  };
};

// hook to separate specific Messages logic from provider
const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: initialMessages } = useMessagesQuery();
  const { data } = useNewMessageSubscription();

  // fetch chat messages in app startup
  useEffect(() => {
    if (initialMessages?.messages) {
      setMessages(initialMessages.messages);
    }
  }, [initialMessages]);

  // handles new message subscription event
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
  const { chatUsers, fetchChatUsers } = useChatUsers();
  const { messages } = useMessages();
  const [enterChat] = useChatEnterMutation();
  const [leaveChat] = useChatLeaveMutation();
  const [sendMessage] = useSendMessageMutation();

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

          fetchChatUsers();
        },

        async leaveChat(nickname) {
          await leaveChat({
            variables: {
              nickname,
            },
          });
        },

        async sendMessage(content, nickname) {
          if (!content) {
            return;
          }

          await sendMessage({
            variables: {
              content,
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
