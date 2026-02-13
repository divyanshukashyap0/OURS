import React from 'react';
import { Trash2, Eye, EyeOff, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface BulkActionToolbarProps {
    selectedCount: number;
    onClearSelection: () => void;
    onDelete: () => void;
    onPublish?: () => void;
    onUnpublish?: () => void;
}

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
    selectedCount,
    onClearSelection,
    onDelete,
    onPublish,
    onUnpublish
}) => {
    if (selectedCount === 0) return null;

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-full px-6 py-3 flex items-center gap-6 z-50"
        >
            <div className="flex items-center gap-3 border-r border-gray-200 dark:border-gray-700 pr-6">
                <span className="font-semibold text-gray-900 dark:text-white bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full text-sm">
                    {selectedCount}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Selected</span>
            </div>

            <div className="flex items-center gap-2">
                {onPublish && (
                    <button
                        onClick={onPublish}
                        title="Publish Selected"
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
                    >
                        <Eye size={18} />
                    </button>
                )}
                {onUnpublish && (
                    <button
                        onClick={onUnpublish}
                        title="Unpublish Selected"
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <EyeOff size={18} />
                    </button>
                )}
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                <button
                    onClick={onDelete}
                    title="Delete Selected"
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <button
                onClick={onClearSelection}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline ml-2"
            >
                Cancel
            </button>
        </motion.div>
    );
};

export default BulkActionToolbar;
