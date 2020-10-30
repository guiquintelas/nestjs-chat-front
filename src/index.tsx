import React from 'react';
import ReactDOM from 'react-dom';
import grey from '@material-ui/core/colors/grey';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { HashRouter } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import App from './App';
import SnackBarProvider from './contexts/SnackBarContext';
import ConfirmProvider from './contexts/ConfirmContext';

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

ReactDOM.render(
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <SnackBarProvider>
          <ConfirmProvider>
            <HashRouter basename="/">
              <App />
            </HashRouter>
          </ConfirmProvider>
        </SnackBarProvider>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </>,
  document.getElementById('root'),
);
