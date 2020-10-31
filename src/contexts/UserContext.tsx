import React, { createContext, useState, useContext, useEffect } from 'react';
import { useChatEnterMutation, useChatLeaveMutation } from '../graphql/generated/graphql';

type UserContextType = {
  user?: string;
  login: (nickname: string) => Promise<void>;
  logout: () => Promise<void>;
};

const USER_STORAGE = 'user';

const loadedJsonUserData = localStorage.getItem(USER_STORAGE);
let defaultUser: string | undefined;

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

  const [enterChat] = useChatEnterMutation();
  const [leaveChat] = useChatLeaveMutation();

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE);
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,

        async login(nickname) {
          if (user) {
            return;
          }

          setUser(nickname);
          await enterChat({
            variables: {
              nickname,
            },
          });
        },

        async logout() {
          if (!user) {
            return;
          }

          await leaveChat({
            variables: {
              nickname: user,
            },
          });
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
