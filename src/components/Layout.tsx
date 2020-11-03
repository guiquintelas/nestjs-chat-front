import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Link,
  makeStyles,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackBarContext } from '../contexts/SnackBarContext';
import { useUserContext } from '../contexts/UserContext';
import Menu from './Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Layout: React.FC = ({ children }) => {
  const classes = useStyles();
  const history = useHistory();
  const { snackBar } = useSnackBarContext();
  const { user, logout } = useUserContext();

  return (
    <>
      <AppBar position="relative" style={{ height: 'fit-content' }}>
        <Container maxWidth="lg" style={{ padding: 0 }}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              <Link href="./" color="inherit" style={{ textDecoration: 'none' }}>
                Nestjs Chat
              </Link>
            </Typography>

            <Box>
              {user && (
                <Menu
                  anchor={
                    <Button color="inherit" style={{ textTransform: 'none' }}>
                      {user}
                    </Button>
                  }
                >
                  <MenuItem
                    onClick={async () => {
                      await logout();
                      history.push('/login');
                      snackBar('See you next time! Bye bye 👋');
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" component="main">
        <Box py={3}>
          <Grid container spacing={4} style={{ overflowX: 'hidden' }}>
            {children}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Layout;
