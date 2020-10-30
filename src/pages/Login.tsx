import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Paper, useTheme } from '@material-ui/core';
import { object, string } from 'yup';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import TextField from '../components/TextField';
import { useUserContext } from '../contexts/UserContext';

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
  const theme = useTheme();
  const history = useHistory();
  const { login } = useUserContext();

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
              login(data.nickname);
              history.push('/chat');
            }}
          >
            <Form>
              <Box>
                <TextField label="Nickname" placeholder="fulano" name="nickname" style={{ width: '100%' }} />
              </Box>

              <Box mt={2} display="flex" justifyContent="flex-end">
                <Button color="primary" variant="contained" type="submit">
                  Enter Chat
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
