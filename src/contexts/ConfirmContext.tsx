import React, { createContext, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

type ConfirmArgs = {
  title: string;
  content: string;
  onOk: () => void;
  onClose?: () => void;
};

type ConfirmContextType = {
  confirm: (args: ConfirmArgs) => void;
};

export const ConfirmContext = createContext<ConfirmContextType>({
  confirm() {
    throw new Error('you should only use this context inside the provider!');
  },
});

type ConfirmState = ConfirmArgs & {
  isOpen: boolean;
};

const ConfirmProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<ConfirmState>({
    title: '',
    content: '',
    onOk: () => {},
    onClose: () => {},
    isOpen: false,
  });

  const close = () => {
    setState((oldState) => ({
      ...oldState,
      isOpen: false,
    }));
  };

  return (
    <ConfirmContext.Provider
      value={{
        confirm({ title, content, onOk, onClose }) {
          setState({
            title,
            content,
            isOpen: true,
            onOk: () => {
              close();
              onOk();
            },
            onClose: () => {
              close();

              if (onClose) {
                onClose();
              }
            },
          });
        },
      }}
    >
      <Dialog maxWidth="xs" aria-labelledby="confirmation-dialog-title" open={state.isOpen} onClose={state?.onClose}>
        <DialogTitle id="confirmation-dialog-title">{state.title}</DialogTitle>
        <DialogContent>{state.content}</DialogContent>
        <DialogActions>
          <Button autoFocus onClick={state?.onClose}>
            Cancel
          </Button>
          <Button onClick={state?.onOk} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {children}
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;

export function useConfirmContext() {
  return useContext(ConfirmContext);
}
