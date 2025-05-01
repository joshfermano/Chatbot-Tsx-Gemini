import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatArea from '../components/Chat/ChatArea';
import ChatInput from '../components/Chat/ChatInput';
import { fetchWithAuth } from '../config/apiConfig';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface OutletContextType {
  activeConversation: string | null;
}

const Homepage = () => {
  const { activeConversation } = useOutletContext<OutletContextType>();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      setMessages([]);
    };

    window.addEventListener('userLoggedOut', handleLogout);

    return () => {
      window.removeEventListener('userLoggedOut', handleLogout);
    };
  }, []);

  // Load guest messages from localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      const savedMessages = localStorage.getItem('guestChat');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }
    }
  }, [isAuthenticated]);

  // Save guest messages to localStorage
  useEffect(() => {
    if (!isAuthenticated && messages.length > 0) {
      localStorage.setItem('guestChat', JSON.stringify(messages));
    }
  }, [messages, isAuthenticated]);

  // Listen for conversation updates
  useEffect(() => {
    const handleConversationUpdate = () => {
      if (activeConversation) {
        fetchMessages(activeConversation);
      }
    };

    window.addEventListener('conversationUpdated', handleConversationUpdate);
    return () => {
      window.removeEventListener(
        'conversationUpdated',
        handleConversationUpdate
      );
    };
  }, [activeConversation]);

  const fetchMessages = async (conversationId: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetchWithAuth(
        `/api/conversations/${conversationId}/messages`
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  // Update messages when active conversation changes
  useEffect(() => {
    if (isAuthenticated && activeConversation) {
      fetchMessages(activeConversation);
    } else if (!isAuthenticated) {
      // Load guest messages (already handled in another useEffect)
    } else {
      setMessages([]);
    }
  }, [activeConversation, isAuthenticated]);

  const handleSendMessage = async (messageText: string) => {
    const userMessage: Message = {
      role: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetchWithAuth('/api/chats/message', {
        method: 'POST',
        body: JSON.stringify({
          message: messageText,
          conversationId: isAuthenticated ? activeConversation : 'guest',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      const botMessage: Message = {
        role: 'model',
        content: data.response,
      };

      setMessages((prev) => [...prev, botMessage]);

      if (isAuthenticated) {
        // Trigger conversation list refresh
        window.dispatchEvent(new CustomEvent('refreshConversations'));
      } else {
        // Save to localStorage for guest mode
        const updatedMessages = [...messages, userMessage, botMessage];
        localStorage.setItem('guestChat', JSON.stringify(updatedMessages));
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'model',
        content:
          "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Function to clear conversation for guest mode
  const handleClearConversation = () => {
    if (!isAuthenticated) {
      // Clear messages state
      setMessages([]);

      // Clear localStorage
      localStorage.removeItem('guestChat');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative overflow-hidden py-3">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 dark:opacity-20">
        <div className="absolute top-0 right-0 bg-gradient-to-b from-blue-600 to-indigo-700 w-72 h-72 rounded-full blur-3xl transform -translate-y-24 translate-x-24"></div>
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-indigo-600 to-blue-700 w-72 h-72 rounded-full blur-3xl transform translate-y-16 -translate-x-16"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20 bg-grid-pattern"></div>

      {/* Content */}
      <div className="flex flex-col h-full z-10 py-3 space-y-2">
        <ChatArea
          messages={messages}
          loading={loading}
          onSendMessage={handleSendMessage}
        />
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={loading}
          onClearConversation={handleClearConversation}
        />
      </div>
    </div>
  );
};

export default Homepage;
