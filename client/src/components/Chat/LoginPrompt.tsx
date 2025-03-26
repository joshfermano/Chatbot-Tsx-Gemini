import { Link } from 'react-router-dom';
import { FiX, FiLogIn, FiUserPlus } from 'react-icons/fi';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPrompt = ({ isOpen, onClose }: LoginPromptProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <FiX size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Want to save your conversations?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in or create an account to save your chat history
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/auth/login"
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <FiLogIn className="mr-2" /> Sign In
          </Link>
          <Link
            to="/auth/register"
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
            <FiUserPlus className="mr-2" /> Create Account
          </Link>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
