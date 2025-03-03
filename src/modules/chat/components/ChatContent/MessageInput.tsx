import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ChangeEvent, FC, KeyboardEvent, useState } from 'react';
import { FaMicrophone, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { FaFaceSmile } from 'react-icons/fa6';
import { useMessageContext } from '@/modules/message/context/MessageContext';
import { useChatContext } from '../../context/ChatContext';

const MessageInput: FC = () => {
  const [showEmojis, setShowEmojis] = useState(false);
  const [message, setMessage] = useState('');

  const { chatSelected } = useChatContext();
  const { sendMessage, chatClicked } = useMessageContext();

  const uploadMedia = (e: ChangeEvent<HTMLInputElement>) => {

  }

  const changeShowEmojiStatus = () => {
    setShowEmojis(prevState => !prevState);
  }

  const onSelectEmoji = (emojiSelected: EmojiClickData) => {
    const { emoji } = emojiSelected;
    setMessage(prevMessage => prevMessage + emoji);
  }

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      hadleSendMessage();
    }
  }

  const hadleSendMessage = async () => {
    await sendMessage(message);
    setMessage('');
    setShowEmojis(false);
  }

  const handleInputClick = async () => {
    setShowEmojis(false);
    chatSelected && chatClicked(chatSelected);
  }

  return (
    <article className='gray-bg p-2'>
      <div className='flex items-center gap-2'>
        <FaPaperclip
          className='h-4 w-4 cursor-pointer'
          onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
        />
        <input
          hidden
          type="file"
          accept='.jpg, .jpeg, .png, .svg, .mp4, .mov, .mp3'
          onChange={uploadMedia}
        />
        <FaFaceSmile className='h-4 w-4 cursor-pointer' onClick={changeShowEmojiStatus} />
        {showEmojis && (
          <div className='absolute bottom-10 left-2'>
            <EmojiPicker onEmojiClick={onSelectEmoji} />
          </div>
        )}
        <input
          type="text"
          className='w-full h-10 px-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Type your message...'
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={handleInputClick}
        />
        {message ? (
          <FaPaperPlane className='h-4 w-4 cursor-pointer' onClick={hadleSendMessage} />
        ) : (
          <FaMicrophone className='h-4 w-4 cursor-pointer' />
        )
        }
      </div>
    </article>
  );
}

export default MessageInput;