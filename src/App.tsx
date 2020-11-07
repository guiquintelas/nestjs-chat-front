import React from 'react';
import { Box, styled } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import ChatProvider from './contexts/ChatContext';
import { useUserContext } from './contexts/UserContext';

const Root = styled(Box)({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  overflow: 'auto',
});

const App: React.FC = () => {
  const { user } = useUserContext();

  return (
    <Root id="app">
      <Switch>
        <Route path="/chat">
          {user ? (
            <ChatProvider>
              <Chat />
            </ChatProvider>
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  errorMsg: 'Please choose your nickname before entering the chat!',
                },
              }}
            />
          )}
        </Route>

        <Route>
          <Login />
        </Route>
      </Switch>
    </Root>
  );
};

export default App;
