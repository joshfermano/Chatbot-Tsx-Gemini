import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiTrash2,
  FiMessageSquare,
  FiLogIn,
  FiSearch,
  FiChevronRight,
  FiClock,
  FiCalendar,
} from 'react-icons/fi';

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
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on search
  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  // Get current date for "Today" label
  const today = new Date().toLocaleDateString();

  return (
    <aside
      className={`
        fixed top-16 left-0 z-40 h-[calc(100vh-64px)] 
        bg-gray-50/95 backdrop-blur-sm dark:bg-gray-900/95
        transition-all duration-300 ease-in-out border-r border-gray-200/30 dark:border-gray-700/30
        ${isOpen ? 'w-72 translate-x-0 shadow-lg' : 'w-0 -translate-x-full'}
        flex flex-col overflow-hidden
      `}>
      {isOpen && (
        <>
          <div className="p-4 flex flex-col gap-3">
            <button
              onClick={onNewConversation}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-full text-white shadow-sm hover:shadow transition-all duration-200 group">
              <FiPlus className="group-hover:rotate-90 transition-transform duration-300" />
              <span>New Chat</span>
            </button>

            {isAuthenticated && conversations.length > 0 && (
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 focus:outline-none dark:placeholder:text-blue-200 focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {isAuthenticated ? (
              <>
                {filteredConversations.length > 0 && (
                  <div className="px-4 py-2 text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase flex items-center">
                    <FiClock className="mr-1.5" size={12} /> Recent
                    Conversations
                  </div>
                )}

                <div className="space-y-1 px-3">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`
                          flex items-center justify-between p-3 rounded-lg cursor-pointer group
                          ${
                            activeConversation === conversation.id
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-sm'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800/70'
                          }
                          text-gray-800 dark:text-gray-200 transition-all duration-200
                        `}
                        onClick={() => onSelectConversation(conversation.id)}>
                        <div className="flex items-center overflow-hidden gap-3 flex-1">
                          <div
                            className={`
                            p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300
                            ${
                              activeConversation === conversation.id
                                ? 'shadow-sm'
                                : ''
                            }
                          `}>
                            <FiMessageSquare className="flex-shrink-0" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate font-medium text-sm">
                              {conversation.title}
                            </span>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <FiCalendar size={10} className="mr-1" />
                              {new Date(
                                conversation.timestamp
                              ).toLocaleDateString() === today
                                ? 'Today'
                                : new Date(
                                    conversation.timestamp
                                  ).toLocaleDateString()}
                            </div>
                          </div>
                          <FiChevronRight
                            size={16}
                            className={`flex-shrink-0 text-gray-400 transition-transform duration-200 opacity-0 group-hover:opacity-100 ${
                              activeConversation === conversation.id
                                ? 'opacity-100'
                                : ''
                            }`}
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-all duration-200"
                          aria-label="Delete conversation">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))
                  ) : searchQuery ? (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No conversations match your search
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                      Start a new conversation
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center space-y-5 bg-white/80 dark:bg-gray-800/50 p-6 rounded-xl shadow-sm border border-gray-100/50 dark:border-gray-700/50">
                  <p className="text-gray-700 dark:text-gray-300">
                    Sign in to save your conversations
                  </p>
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-md transition-all duration-200">
                    <FiLogIn className="mr-2" /> Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-700/50">
            Perps Bot &copy; {new Date().getFullYear()}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
