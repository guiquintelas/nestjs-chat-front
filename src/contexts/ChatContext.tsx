import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  useChatEnterMutation,
  useChatLeaveMutation,
  useChatListUsersQuery,
  useChatUserEnteredSubscription,
  useChatUserLeavedSubscription,
} from '../graphql/generated/graphql';
import { useSnackBarContext } from './SnackBarContext';

type ChatContextType = {
  chatUsers: string[];
  enterChat: (nickname: string) => Promise<void>;
  leaveChat: (nickname: string) => Promise<void>;
};

export const ChatContext = createContext<ChatContextType>({
  chatUsers: [],
  enterChat: () => {
    throw new Error('you should only use this context inside the provider!');
  },
  leaveChat: () => {
    throw new Error('you should only use this context inside the provider!');
  },
});

const ChatProvider: React.FC = ({ children }) => {
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const [enterChat] = useChatEnterMutation();
  const [leaveChat] = useChatLeaveMutation();
  const { snackBar } = useSnackBarContext();

  const { data: userEntered } = useChatUserEnteredSubscription();
  const { data: userLeaved } = useChatUserLeavedSubscription();

  const { data } = useChatListUsersQuery();

  useEffect(() => {
    if (data?.chatListUsers) {
      setChatUsers(data.chatListUsers);
    }
  }, [data]);

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

  return (
    <ChatContext.Provider
      value={{
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
