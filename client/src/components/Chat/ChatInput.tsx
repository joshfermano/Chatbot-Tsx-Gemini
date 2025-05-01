import { useState, FormEvent, useRef, useEffect } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import LoginPrompt from './LoginPrompt';
import ClearConfirmationDialog from './ClearConfirmationDialog';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClearConversation?: () => void;
}

const ChatInput = ({
  onSendMessage,
  isLoading,
  onClearConversation,
}: ChatInputProps) => {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 100); // Max 100px height (reduced from 120px)
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Show login prompt for first message if user is not authenticated
    if (!isAuthenticated && message.trim()) {
      setShowLoginPrompt(true);
      return;
    }

    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearClick = () => {
    setShowClearConfirmation(true);
  };

  return (
    <>
      <div className="py-3 px-4 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm bg-gradient-to-b from-transparent to-white/70 dark:to-gray-900/70">
        <form
          onSubmit={handleSubmit}
          className={`
            w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl py-2 px-3 
            flex items-center shadow-md border transition-all duration-300
            ${
              isFocused
                ? 'border-blue-400 dark:border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900/50'
                : 'border-gray-200/80 dark:border-gray-700/80'
            }
          `}>
          <textarea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              isAuthenticated
                ? 'Ask Perps something...'
                : 'Ask Perps something... (Guest Mode)'
            }
            className="flex-grow resize-none bg-transparent border-none outline-none max-h-[100px] py-1.5 px-1.5 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
            rows={1}
          />

          {/* Future feature placeholder */}
          {/* <button 
            type="button" 
            className="text-gray-400 dark:text-gray-500 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mr-1"
            aria-label="Add emoji"
          >
            <FiSmile />
          </button> */}

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`
              p-2 rounded-full transition-all duration-300 flex-shrink-0
              ${
                message.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm hover:shadow-md hover:scale-105'
                  : 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
              }
            `}
            aria-label="Send message">
            <FiSend
              size={16}
              className={
                message.trim() && !isLoading
                  ? 'transform translate-x-0.5 -translate-y-0.5'
                  : ''
              }
            />
          </button>
        </form>

        <div className="flex justify-between items-center mt-2 max-w-3xl mx-auto px-1">
          <div className="text-xs text-gray-400 dark:text-gray-500">
            {isAuthenticated ? (
              <span className="italic">Press Enter to send</span>
            ) : (
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Guest Mode
              </span>
            )}
          </div>

          {!isAuthenticated && (
            <button
              onClick={handleClearClick}
              className="flex items-center text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors gap-1.5"
              aria-label="Clear conversation">
              <FiTrash2 size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <LoginPrompt
        isOpen={showLoginPrompt}
        onClose={() => {
          setShowLoginPrompt(false);
          onSendMessage(message.trim());
          setMessage('');
        }}
      />

      <ClearConfirmationDialog
        isOpen={showClearConfirmation}
        onClose={() => setShowClearConfirmation(false)}
        onConfirm={() => {
          if (onClearConversation) {
            onClearConversation();
          }
          setShowClearConfirmation(false);
        }}
      />
    </>
  );
};

export default ChatInput;
