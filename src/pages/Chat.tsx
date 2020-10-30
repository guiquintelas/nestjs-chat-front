import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSnackBarContext } from '../contexts/SnackBarContext';
import { useUserContext } from '../contexts/UserContext';

const Chat: React.FC = () => {
  const { user } = useUserContext();
  const history = useHistory();
  const { snackBar } = useSnackBarContext();

  useEffect(() => {
    if (!user) {
      history.push('/login');
      snackBar('Please choose your nickname before entering the chat!', 'danger');
    }
  }, []);

  return <Layout>chat</Layout>;
};

export default Chat;
