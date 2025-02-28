import ChatContent from '@/modules/chat/components/ChatContent/ChatContent';
import ChatList from '@/modules/chat/components/ChatList';
import { FC } from 'react';

const Home: FC = () => {
  return (
    <>
      <ChatList />
      <ChatContent />
    </>
  );
}

export default Home;