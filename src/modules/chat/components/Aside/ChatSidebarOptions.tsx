import { FC } from 'react';
import { ArrowLeftEndOnRectangleIcon, ChatBubbleBottomCenterIcon, UserCircleIcon } from "@heroicons/react/24/solid";

const ChatSidebarOptions: FC = () => {
  return (
    <>
      <div>
        <ChatBubbleBottomCenterIcon className="h-5 w-5 cursor-pointer" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserCircleIcon className="h-5 w-5 cursor-pointer" />
        <ArrowLeftEndOnRectangleIcon className="h-5 w-5 cursor-pointer" />
      </div>
    </>
  );
}

export default ChatSidebarOptions;