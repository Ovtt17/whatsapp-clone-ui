import {FC} from 'react';
import ChatsAside from "../../modules/chat/components/Aside/ChatsAside.tsx";

const Home: FC = () => {
  return (
    <section className="flex justify-center items-center min-h-screen">
      <header className="absolute top-0 w-full h-1/5 bg-[#1ea884]"></header>
      <main className="flex relative w-4/5 max-w-full h-[calc(100vh-40px)] bg-white shadow-2xl">
        <ChatsAside />
      </main>
    </section>
  );
}

export default Home;