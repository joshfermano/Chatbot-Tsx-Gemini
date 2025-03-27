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

  useEffect(() => {
    if (!isAuthenticated) {
      const savedMessages = localStorage.getItem('guestChat');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && messages.length > 0) {
      localStorage.setItem('guestChat', JSON.stringify(messages));
    }
  }, [messages, isAuthenticated]);

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

  // Update the activeConversation effect
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  useEffect(() => {
    const loadMessages = async () => {
      if (isAuthenticated && activeConversation) {
        try {
          const response = await fetchWithAuth(
            `/api/conversations/${activeConversation}/messages`
          );

          if (response.ok) {
            const data = await response.json();
            setMessages(data.messages || []);
          }
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      } else if (!isAuthenticated) {
        // Load guest messages from localStorage
        const savedMessages = localStorage.getItem('guestChat');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          setMessages([]);
        }
      }
    };

    loadMessages();
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

  // New function to clear conversation for guest mode
  const handleClearConversation = () => {
    if (!isAuthenticated) {
      // Clear messages state
      setMessages([]);

      // Clear localStorage
      localStorage.removeItem('guestChat');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <ChatArea messages={messages} loading={loading} />
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={loading}
        onClearConversation={handleClearConversation}
      />
    </div>
  );
};

export default Homepage;
