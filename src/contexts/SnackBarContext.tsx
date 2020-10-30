import React, { createContext, useContext, useState } from 'react';
import { IconButton, Snackbar, useTheme } from '@material-ui/core';
import { Close } from 'mdi-material-ui';

type SnackTypes = 'info' | 'danger';

type SnackBarContextType = {
  snackBar: (text: string, type?: SnackTypes) => void;
};

export const SnackBarContext = createContext<SnackBarContextType>({
  snackBar: () => {
    throw new Error('you should only use this context inside the provider!');
  },
});

const SnackBarProvider: React.FC = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<SnackTypes>('info');
  const theme = useTheme();

  return (
    <SnackBarContext.Provider
      value={{
        snackBar: (snackText, snackType = 'info') => {
          setOpen(true);
          setText(snackText);
          setType(snackType);
        },
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isOpen}
        autoHideDuration={4000}
        message={text}
        ContentProps={{
          style: type === 'danger' ? { backgroundColor: theme.palette.error.main } : {},
        }}
        onClose={(_, reason) => {
          if (reason === 'clickaway') {
            return;
          }

          setOpen(false);
        }}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        }
      />
    </SnackBarContext.Provider>
  );
};

export default SnackBarProvider;

export function useSnackBarContext() {
  return useContext(SnackBarContext);
}
