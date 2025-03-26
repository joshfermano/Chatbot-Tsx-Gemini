import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiLogOut,
  FiLogIn,
  FiUser,
} from 'react-icons/fi';
import Perpslogo from '../assets/perpslogo.png';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const { user, logout, isAuthenticated, refreshAuth } = useAuth();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshAuth();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setDarkMode(systemDark);
      document.documentElement.classList.toggle('dark', systemDark);
      localStorage.setItem('theme', systemDark ? 'dark' : 'light');
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white dark:bg-darkBlue text-darkBlue dark:text-white border-b border-gray-200">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <Link to="/" className="flex items-center">
          <img
            src={Perpslogo}
            alt="Perps Logo"
            className="w-8 h-10 mr-4 hidden md:flex"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/vite.svg';
            }}
          />
          <span className="font-semibold text-md md:text-xl">Perps Bot</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={
            darkMode ? 'Switch to light mode' : 'Switch to dark mode'
          }>
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center justify-between space-x-2">
              <h1 className="text-md md:text-xl">{user?.username}</h1>

              <div className="p-2 bg-blue-700 rounded-full text-light">
                <FiUser className="text-md md:text-xl" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-md md:text-xl bg-red-600 text-light p-2 rounded-full cursor-pointer">
              <FiLogOut />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/auth/login"
              className="flex items-center px-3 py-1.5 text-xs md:text-sm font-medium bg-blue-800 hover:bg-darkBlue hover:text-light rounded-md text-white hover:scale-105 dark:hover:bg-light dark:hover:text-darkBlue transition-all duration-500">
              <FiLogIn className="mr-1" /> Login
            </Link>
            <Link
              to="/auth/register"
              className="flex items-center px-3 py-1.5 text-xs md:text-sm font-medium bg-blue-800 hover:bg-darkBlue hover:text-light rounded-md text-white hover:scale-105 dark:hover:bg-light dark:hover:text-darkBlue transition-all duration-500">
              <FiUser className="mr-1" /> Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
