import { useState, FormEvent, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px height
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
      <div className="p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-full py-2 px-4 flex items-center shadow-md border border-gray-200 dark:border-gray-700">
          <textarea
            ref={textAreaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAuthenticated
                ? 'Ask Perps something...'
                : 'Ask Perps something... (Guest Mode)'
            }
            className="flex-grow resize-none bg-transparent border-none outline-none max-h-[120px] py-2 px-2 text-gray-800 dark:text-gray-200"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`
              p-2 rounded-full transition-colors ml-2
              ${
                message.trim() && !isLoading
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                  : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
              }
            `}
            aria-label="Send message">
            <FiSend size={18} />
          </button>
        </form>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isAuthenticated ? (
              'Press Enter to send, Shift+Enter for new line'
            ) : (
              <>
                Guest Mode -{' '}
                <Link
                  to="/auth/login"
                  className="text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>{' '}
                to save conversations
              </>
            )}
          </div>

          {!isAuthenticated && (
            <button
              onClick={handleClearClick}
              className="flex items-center text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              aria-label="Clear conversation">
              <FiTrash2 size={14} className="mr-1" /> Clear Conversation
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
        }}
      />
    </>
  );
};

export default ChatInput;
