import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSnackBarContext } from '../contexts/SnackBarContext';
import { useUserContext } from '../contexts/UserContext';
import { useChatUserEnteredSubscription, useChatUserLeavedSubscription } from '../graphql/generated/graphql';

const Chat: React.FC = () => {
  const { user } = useUserContext();
  const history = useHistory();
  const { snackBar } = useSnackBarContext();
  const { data: userEntered } = useChatUserEnteredSubscription();
  const { data: userLeaved } = useChatUserLeavedSubscription();

  useEffect(() => {
    async function init() {
      if (!user) {
        history.push('/login');
        snackBar('Please choose your nickname before entering the chat!', 'danger');
      }
    }
    init();

    return () => {};
  });

  useEffect(() => {
    if (!userEntered?.chatUserEntered) {
      return;
    }

    snackBar(`The user ${userEntered.chatUserEntered} has joined!`);
  }, [userEntered]);

  useEffect(() => {
    if (!userLeaved?.chatUserLeaved) {
      return;
    }

    snackBar(`The user ${userLeaved.chatUserLeaved} has leaved the chat!`);
  }, [userLeaved]);

  return <Layout>Chat placeholder</Layout>;
};

export default Chat;
