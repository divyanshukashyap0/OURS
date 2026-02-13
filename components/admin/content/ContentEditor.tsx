import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Edit2 } from 'lucide-react';

interface ContentEditorProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    rows?: number;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ value, onChange, label, placeholder, rows = 6 }) => {
    const [isPreview, setIsPreview] = useState(false);

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
                <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                    {isPreview ? <><Edit2 size={12} /> Edit Markdown</> : <><Eye size={12} /> Preview</>}
                </button>
            </div>

            {isPreview ? (
                <div className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 prose dark:prose-invert max-w-none min-h-[150px] overflow-y-auto">
                    {value ? <ReactMarkdown>{value}</ReactMarkdown> : <span className="text-gray-400 italic">Nothing to preview</span>}
                </div>
            ) : (
                <textarea
                    rows={rows}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
                    placeholder={placeholder || "Write in markdown..."}
                />
            )}
        </div>
    );
};

export default ContentEditor;
