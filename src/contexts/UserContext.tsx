import React, { createContext, useContext, useEffect, useState } from 'react';
import { useChatContext } from './ChatContext';

type UserContextType = {
  user?: string;
  login: (nickname: string) => Promise<void>;
  logout: () => Promise<void>;
};

const USER_STORAGE = 'user';

const loadedJsonUserData = localStorage.getItem(USER_STORAGE);
let defaultUser: string | undefined;

// tries to initialize user with local storage data
try {
  defaultUser = loadedJsonUserData ? JSON.parse(loadedJsonUserData) : undefined;
} catch (_) {
  // if json is corrupted
  defaultUser = undefined;
}

export const UserContext = createContext<UserContextType>({
  user: defaultUser,
  login: () => {
    throw new Error('you should only use this context inside the provider!');
  },
  logout: () => {
    throw new Error('you should only use this context inside the provider!');
  },
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<string | undefined>(defaultUser);
  const { enterChat, leaveChat } = useChatContext();

  // persists every user change in local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE);
    }
  }, [user]);

  // make sure the users in is chat
  // this fixes when the backend DB is cleared but
  // the browser localstorage still has the users persisted
  useEffect(() => {
    const autoEnterChat = async () => {
      if (user) {
        await enterChat(user);
      }
    };
    autoEnterChat();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,

        async login(nickname) {
          if (user) {
            return;
          }

          setUser(nickname);
          await enterChat(nickname);
        },

        async logout() {
          if (!user) {
            return;
          }

          await leaveChat(user);
          setUser(undefined);
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export function useUserContext() {
  return useContext(UserContext);
}
