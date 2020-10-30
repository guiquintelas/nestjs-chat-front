import React, { useEffect } from 'react';
import MuiTextfield, { TextFieldProps as MuiTextFieldProps } from '@material-ui/core/TextField';
import { useField, useFormikContext } from 'formik';
import { Box, InputAdornment } from '@material-ui/core';

export type TextFieldProps = MuiTextFieldProps & {
  name: string;
  icon?: JSX.Element;
};

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, icon, disabled, value, InputProps, helperText, ...props }, ref) => {
    const [field, meta] = useField(name);
    const { isSubmitting, setFieldValue } = useFormikContext();

    // every time the prop 'value' changes
    // it reflects in formik state
    useEffect(() => {
      setFieldValue(name, value ?? '');
    }, [name, value, setFieldValue]);

    const iconAdornment = icon ? <InputAdornment position="start">{icon}</InputAdornment> : null;

    return (
      <Box mb={helperText ? 1 : 'auto'}>
        <MuiTextfield
          inputRef={ref}
          {...field}
          {...props}
          error={meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? meta.error : helperText}
          disabled={disabled || isSubmitting}
          InputProps={{
            ...InputProps,
            startAdornment: iconAdornment,
          }}
        />
      </Box>
    );
  },
);

export default TextField;
