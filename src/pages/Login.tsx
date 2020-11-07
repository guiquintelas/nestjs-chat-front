import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Paper, useTheme } from '@material-ui/core';
import { object, string } from 'yup';
import { Form, Formik } from 'formik';
import { useHistory, useLocation } from 'react-router-dom';
import TextField from '../components/TextField';
import { useUserContext } from '../contexts/UserContext';
import { useSnackBarContext } from '../contexts/SnackBarContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100vh',
  },

  loginPaper: {
    width: '360px',
    padding: theme.spacing(4),
    marginBottom: theme.spacing(5),
  },
}));

const Login: React.FC = () => {
  const classes = useStyles();
  const { snackBar } = useSnackBarContext();
  const theme = useTheme();
  const history = useHistory();
  const location = useLocation();
  const { login, user } = useUserContext();
  const [loggedInUser, setCurrentUser] = useState<string | undefined>();

  useEffect(() => {
    setCurrentUser(user);

    if (location?.state?.errorMsg) {
      snackBar('Please choose your nickname before entering the chat!', 'danger');
    }
  }, []);

  return (
    <Grid container direction="row" justify="center" alignItems="center" className={classes.root}>
      <Paper className={classes.loginPaper}>
        <Grid container spacing={1} direction="column">
          <Typography color="textSecondary" style={{ paddingBottom: theme.spacing(3) }}>
            Choose your nickname
          </Typography>

          <Formik
            initialValues={{ nickname: '' }}
            validationSchema={object({
              nickname: string().required('Fill with your nickname!'),
            })}
            onSubmit={async (data) => {
              await login(data.nickname);
              history.push('/chat');
            }}
          >
            <Form>
              <Box>
                <TextField label="Nickname" name="nickname" value={loggedInUser ?? ''} style={{ width: '100%' }} />
              </Box>

              {loggedInUser && (
                <Box py={1} textAlign="center">
                  {"You're already logged in! If you join the chat "}
                  <em>again</em>
                  {' the old nickname will be lost!'}
                </Box>
              )}

              <Box mt={2} display="flex" justifyContent="flex-end">
                {loggedInUser && (
                  <Box pr={2}>
                    <Button onClick={() => history.push('/chat')}>Go back</Button>
                  </Box>
                )}

                <Button color="primary" variant="contained" type="submit">
                  {loggedInUser ? 'Enter Chat Again' : 'Enter Chat'}
                </Button>
              </Box>
            </Form>
          </Formik>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Login;
