import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { fetchWithAuth } from '../config/apiConfig';

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthenticated) {
        setConversations([]);
        setActiveConversation(null);
        return;
      }

      try {
        const response = await fetchWithAuth('/api/conversations');

        if (response.ok) {
          const data = await response.json();
          setConversations(data || []);

          // Only set active conversation if none is selected
          if (!activeConversation && data.length > 0) {
            setActiveConversation(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };

    fetchConversations();

    // Listen for conversation updates
    const handleRefreshConversations = () => {
      fetchConversations();
    };

    window.addEventListener('refreshConversations', handleRefreshConversations);
    return () => {
      window.removeEventListener(
        'refreshConversations',
        handleRefreshConversations
      );
    };
  }, [isAuthenticated, activeConversation]);

  const handleSelectConversation = (id: string) => {
    if (!isAuthenticated) return;
    setActiveConversation(id);
  };

  const handleNewConversation = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    try {
      const response = await fetchWithAuth('/api/conversations', {
        method: 'POST',
        body: JSON.stringify({
          title: `Chat ${conversations.length + 1}`,
        }),
      });

      if (response.ok) {
        const newConversation = await response.json();
        setConversations((prev) => [newConversation, ...prev]);
        setActiveConversation(newConversation.id);

        const event = new CustomEvent('newConversation');
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetchWithAuth(`/api/conversations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setConversations((prev) => prev.filter((conv) => conv.id !== id));
        if (activeConversation === id) {
          setActiveConversation(null);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  useEffect(() => {
    const createInitialConversation = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetchWithAuth('/api/conversations');

          if (response.ok) {
            const existingConversations = await response.json();
            if (existingConversations.length > 0) {
              setConversations(existingConversations);
              setActiveConversation(existingConversations[0].id);
              return;
            }

            const createResponse = await fetchWithAuth('/api/conversations', {
              method: 'POST',
              body: JSON.stringify({
                title: 'First Chat',
              }),
            });

            if (createResponse.ok) {
              const newConversation = await createResponse.json();
              setConversations([newConversation]);
              setActiveConversation(newConversation.id);
            }
          }
        } catch (error) {
          console.error('Error handling initial conversation:', error);
        }
      }
    };

    createInitialConversation();
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen dark:bg-darkBlue">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          isAuthenticated={isAuthenticated}
        />

        <main
          className={`
            flex-1 transition-all duration-300 
            ${isSidebarOpen ? 'ml-64' : 'ml-0'}
          `}>
          <Outlet context={{ activeConversation }} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
