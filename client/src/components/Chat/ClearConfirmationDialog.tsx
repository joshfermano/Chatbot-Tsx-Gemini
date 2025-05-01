import { FiTrash2 } from 'react-icons/fi';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full mx-4 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}>
        {/* Icon Header */}
        <div className="pt-8 pb-4 flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <FiTrash2 className="w-6 h-6 text-red-500 dark:text-red-400" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Clear conversation
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            This will permanently delete all messages in this conversation
          </p>

          {/* Actions */}
          <div className="flex space-x-3 justify-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              Cancel
            </button>

            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
              Clear conversation
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};

export default ClearConfirmationDialog;
