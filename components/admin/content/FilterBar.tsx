import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
    filters?: {
        label: string;
        options: FilterOption[];
        value: string;
        onChange: (value: string) => void;
    }[];
    sortOptions?: FilterOption[];
    sortBy?: string;
    onSortChange?: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm,
    onSearchChange,
    placeholder = "Search...",
    filters = [],
    sortOptions = [],
    sortBy,
    onSortChange
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-sm"
                />
            </div>

            {/* Filters & Sort */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
                {filters.map((filter) => (
                    <div key={filter.label} className="flex items-center gap-2">
                        <select
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        >
                            <option value="">{filter.label}</option>
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                ))}

                {sortOptions.length > 0 && onSortChange && (
                    <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-3">
                        <span className="text-gray-400"><ArrowUpDown size={16} /></span>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                        >
                            <option value="">Sort By</option>
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
