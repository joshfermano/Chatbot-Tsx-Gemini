import { Link } from 'react-router-dom';
import { FiPlus, FiTrash2, FiMessageSquare, FiLogIn } from 'react-icons/fi';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isAuthenticated: boolean;
}

const Sidebar = ({
  isOpen,
  conversations = [],
  activeConversation,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isAuthenticated,
}: SidebarProps) => {
  return (
    <aside
      className={`
        fixed top-16 left-0 z-40 h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-800 
        transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}
        flex flex-col overflow-hidden
      `}>
      {isOpen && (
        <>
          <div className="p-4">
            <button
              onClick={onNewConversation}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-800 hover:bg-darkBlue hover:text-light rounded-md text-white hover:scale-105 dark:hover:bg-light dark:hover:text-darkBlue transition-all duration-500 cursor-pointer">
              <FiPlus /> New Chat
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            {isAuthenticated ? (
              <>
                {conversations.length > 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    RECENT CONVERSATIONS
                  </div>
                )}

                <div className="space-y-1 px-2">
                  {conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`
                          flex items-center justify-between p-2 rounded-md cursor-pointer group
                          ${
                            activeConversation === conversation.id
                              ? 'bg-indigo-100 dark:bg-indigo-900'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                          text-gray-800 dark:text-gray-200
                        `}
                        onClick={() => onSelectConversation(conversation.id)}>
                        <div className="flex items-center overflow-hidden">
                          <FiMessageSquare className="flex-shrink-0 mr-2" />
                          <span className="truncate">{conversation.title}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                          aria-label="Delete conversation">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Start a new conversation
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Sign in to save your conversations
                  </p>
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium bg-blue-800 hover:bg-darkBlue hover:text-light rounded-md text-white hover:scale-105 dark:hover:bg-light dark:hover:text-darkBlue transition-all duration-500">
                    <FiLogIn className="mr-2" /> Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
