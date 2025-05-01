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
  FiChevronDown,
} from 'react-icons/fi';
import Perpslogo from '../assets/perpslogo.png';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const { user, logout, isAuthenticated, refreshAuth } = useAuth();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
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
    setShowUserMenu(false);
    navigate('/');
  };

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md dark:bg-gray-900/95 text-gray-800 dark:text-white border-b border-gray-200/30 dark:border-gray-800/80 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
          {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <Link
          to="/"
          className="flex items-center gap-3 transition-transform hover:scale-[1.01]">
          <div className="relative">
            <img
              src={Perpslogo}
              alt="Perps Logo"
              className="w-8 h-10 hidden md:block"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/vite.svg';
              }}
            />
            {/* Subtle glow effect */}
            <div className="absolute -inset-0.5 bg-blue-500/20 rounded-full blur-sm -z-10 hidden md:block dark:bg-blue-500/30"></div>
          </div>
          <span className="font-semibold text-md md:text-xl tracking-tight">
            Perps Bot
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          aria-label={
            darkMode ? 'Switch to light mode' : 'Switch to dark mode'
          }>
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white shadow-sm">
                  <FiUser className="text-sm" />
                </div>
              </div>
              <span className="hidden md:inline text-sm font-medium truncate max-w-[100px]">
                {user?.username}
              </span>
              <FiChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium truncate">
                    {user?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <FiLogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/auth/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-md transition-all duration-200">
              <FiLogIn size={14} />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link
              to="/auth/register"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-200">
              <FiUser size={14} /> Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
