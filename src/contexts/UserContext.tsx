import React, { createContext, useContext, useEffect, useState } from 'react';
import wsLink from '..';
import { useChatEnterMutation, useChatLeaveMutation } from '../graphql/generated/graphql';

type UserContextType = {
  user?: string;
  login: (nickname: string) => Promise<void>;
  logout: () => Promise<void>;
};

const USER_STORAGE = 'user';

export const getUserFromLocalStorage = (): string | undefined => {
  const loadedJsonUserData = localStorage.getItem(USER_STORAGE);

  // tries to initialize user with local storage data
  try {
    return loadedJsonUserData ? JSON.parse(loadedJsonUserData) : undefined;
  } catch (_) {
    // if json is corrupted
    return undefined;
  }
};

const defaultUser = getUserFromLocalStorage();

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
  const [enterChat] = useChatEnterMutation();
  const [leaveChat] = useChatLeaveMutation();
  const [user, setUser] = useState<string | undefined>(defaultUser);

  // persists every user change in local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE, JSON.stringify(user));
      if (wsLink) {
        try {
          (wsLink as any).subscriptionClient.close(false, false);
        } catch (error) {
          console.log('No websocket was found');
        }
      }
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
            await leaveChat({
              variables: {
                nickname: user,
              },
            });
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
