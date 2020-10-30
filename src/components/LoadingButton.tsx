import React from 'react';
import MuiButton, { ButtonProps } from '@material-ui/core/Button';
import { useFormikContext } from 'formik';
import { CircularProgress, makeStyles, createStyles } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  }),
);

const LoadingButton: React.FC<ButtonProps> = ({ disabled, children, ...props }) => {
  const { isSubmitting } = useFormikContext();
  const classes = useStyles();

  return (
    <MuiButton {...props} disabled={disabled ?? isSubmitting} style={{ display: 'inline-block' }}>
      {isSubmitting ? <CircularProgress size={24} className={classes.buttonProgress} /> : <div>{children}</div>}
    </MuiButton>
  );
};

export default LoadingButton;
