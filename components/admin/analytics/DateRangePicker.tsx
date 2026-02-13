import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
    value: '7d' | '30d' | '90d' | 'year' | 'all';
    onChange: (value: '7d' | '30d' | '90d' | 'year' | 'all') => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
    const options: { label: string; value: '7d' | '30d' | '90d' | 'year' | 'all' }[] = [
        { label: 'Last 7 Days', value: '7d' },
        { label: 'Last 30 Days', value: '30d' },
        { label: 'Last 3 Months', value: '90d' },
        { label: 'Last Year', value: 'year' },
        { label: 'All Time', value: 'all' },
    ];

    return (
        <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${value === option.value
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default DateRangePicker;
