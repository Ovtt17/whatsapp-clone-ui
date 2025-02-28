import { FC, ReactNode } from 'react';
import ChatSidebarOptions from '../modules/chat/components/Aside/ChatSidebarOptions';

export const DefaultLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <header className="absolute top-0 w-full h-1/5 bg-[#1ea884]"></header>
      <div className="flex relative w-11/12 max-w-full h-[calc(100vh-40px)] bg-white shadow-2xl">
        <aside className='flex flex-col justify-between items-center p-3 gray-bg'>
          <ChatSidebarOptions />
        </aside>
        <main className='flex w-full'>
          {children}
        </main>
      </div>
    </div>
  );
}
