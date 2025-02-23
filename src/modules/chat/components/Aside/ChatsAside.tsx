import {FC} from 'react';
import {ArrowLeftEndOnRectangleIcon, ChatBubbleBottomCenterIcon, UserCircleIcon} from "@heroicons/react/24/solid";

const ChatsAside: FC = () => {
  return (
    <aside className="flex flex-col justify-between items-center p-3 gray-bg">
      <div>
        <ChatBubbleBottomCenterIcon className="h-6 w-6 cursor-pointer"/>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserCircleIcon className="h-6 w-6 cursor-pointer"/>
        <ArrowLeftEndOnRectangleIcon className="h-6 w-6 cursor-pointer"/>
      </div>
    </aside>
  );
}

export default ChatsAside;