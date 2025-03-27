import { FiX, FiAlertTriangle } from 'react-icons/fi';

interface ClearConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: ClearConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <FiX size={24} />
        </button>

        <div className="flex items-center justify-center text-amber-500 mb-4">
          <FiAlertTriangle size={36} />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Clear conversation?
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            This will delete all messages in your current conversation. This
            action cannot be undone.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearConfirmationDialog;
