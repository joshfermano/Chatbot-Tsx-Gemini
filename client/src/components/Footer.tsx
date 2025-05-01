import { FiGithub, FiGlobe } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-3 px-4 sm:px-6 text-gray-800 dark:text-white bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="flex flex-col items-center md:flex-row md:justify-between text-xs max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
            P
          </div>
          <span className="font-medium tracking-wide">Perps Chatbot</span>
        </div>

        <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/joshfermano"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FiGithub size={16} />
            </a>
            <a
              href="https://www.joshfermano.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <FiGlobe size={16} />
            </a>
          </div>

          <div className="text-center text-xs opacity-80">
            &copy; {currentYear} Josh Khovick Fermano
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
