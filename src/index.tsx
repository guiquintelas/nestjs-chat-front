import { WebSocketLink } from '@apollo/client/link/ws';
import React from 'react';
import ReactDOM from 'react-dom';
import grey from '@material-ui/core/colors/grey';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { HashRouter } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import App from './App';
import SnackBarProvider from './contexts/SnackBarContext';
import ConfirmProvider from './contexts/ConfirmContext';
import UserProvider from './contexts/UserContext';

let theme = createMuiTheme();

theme = {
  ...theme,
  overrides: {
    MuiButton: {
      root: {
        color: grey[600],
      },
    },
    MuiInputBase: {
      root: {
        marginBottom: '22px',
      },
      input: {
        color: theme.palette.text.primary,
      },
      adornedStart: {
        color: grey[600],
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: '8px',
      },
    },
    MuiFormHelperText: {
      root: {
        marginTop: '-19px',
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: '8px',
      },
    },
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
    },
    MuiPaper: {
      elevation: 3,
    },
  },
};

const API_LINK = process.env.REACT_APP_API_URL ?? 'http://localhost:3000/graphql';

const httpLink = new HttpLink({
  uri: API_LINK,
});

const wsLink = new WebSocketLink({
  uri: API_LINK.replace('http', 'ws'),
  options: {
    reconnect: true,
  },
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

ReactDOM.render(
  <>
    <CssBaseline />
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <SnackBarProvider>
            <ConfirmProvider>
              <UserProvider>
                <HashRouter basename="/">
                  <App />
                </HashRouter>
              </UserProvider>
            </ConfirmProvider>
          </SnackBarProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </ApolloProvider>
  </>,
  document.getElementById('root'),
);
