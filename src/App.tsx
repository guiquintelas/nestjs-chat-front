import React from 'react';
import { Box, styled } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';

const Root = styled(Box)({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  overflow: 'auto',
});

const App: React.FC = () => (
  <Root id="app">
    <Switch>
      <Route path="/chat">
        <Chat />
      </Route>

      <Route>
        <Login />
      </Route>
    </Switch>
  </Root>
);

export default App;
