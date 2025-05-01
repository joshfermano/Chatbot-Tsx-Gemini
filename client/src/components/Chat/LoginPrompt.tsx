import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPrompt = ({ isOpen, onClose }: LoginPromptProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full mx-4 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="py-6 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Save your conversations
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create an account to access your chat history anywhere
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <Link
            to="/auth/login"
            className="w-full flex justify-between items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-white bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/60 dark:hover:bg-gray-700 transition-colors">
            Sign in with existing account
            <FiArrowRight className="text-gray-400" />
          </Link>

          <Link
            to="/auth/register"
            className="w-full flex justify-between items-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors">
            Create new account
            <FiArrowRight className="text-white/70" />
          </Link>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors">
            Continue without account
          </button>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default LoginPrompt;
